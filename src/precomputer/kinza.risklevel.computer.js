const { ethers } = require('ethers');
const { sleep, fnName, roundTo, retry } = require('../utils/utils');
const { default: axios } = require('axios');
const { RecordMonitoring } = require('../utils/monitoring');
const { pairsToCompute } = require('./kinza.risklevel.computer.config');
const { protocolDataProviderAddress } = require('./kinza.risklevel.computer.config');
const { protocolDataProviderABI } = require('./kinza.risklevel.computer.config');
const path = require('path');
const { DATA_DIR } = require('../utils/constants');
const fs = require('fs');
const { WaitUntilDone, SYNC_FILENAMES } = require('../utils/sync');
const { getConfTokenBySymbol } = require('../utils/token.utils');

const RPC_URL = process.env.RPC_URL;
const web3Provider = new ethers.providers.StaticJsonRpcProvider(RPC_URL);
const RUN_EVERY_MINUTES = process.env.RUN_EVERY || 3 * 60; // in minutes
const MONITORING_NAME = 'Kinza Risk Level';

/**
 * Precompute data for the risk oracle front
 */
async function precomputeRiskLevelKinza(onlyOnce = false) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    await WaitUntilDone(SYNC_FILENAMES.FETCHERS_LAUNCHER);
    const runStartDate = Date.now();
    try {
      await RecordMonitoring({
        name: MONITORING_NAME,
        status: 'running',
        lastStart: Math.round(runStartDate / 1000),
        runEvery: RUN_EVERY_MINUTES * 60
      });

      const dirPath = path.join(DATA_DIR, 'precomputed', 'dashboard');
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      const promises = [];
      for (const base of Object.keys(pairsToCompute)) {
        const promise = computeDataForPair(base, pairsToCompute[base]);
        await promise;
        promises.push(promise);
      }

      const allPairs = await Promise.all(promises);

      const kinzaOverview = {};
      for (const pair of allPairs) {
        for (const base of Object.keys(pair)) {
          kinzaOverview[base] = pair[base];
        }
      }

      const stringified = JSON.stringify(kinzaOverview, null, 2);
      console.log(stringified);
      fs.writeFileSync(path.join(dirPath, 'kinza-overview.json'), stringified);

      const runEndDate = Math.round(Date.now() / 1000);
      await RecordMonitoring({
        name: MONITORING_NAME,
        status: 'success',
        lastEnd: runEndDate,
        lastDuration: runEndDate - Math.round(runStartDate / 1000)
      });
    } catch (error) {
      console.error(error);
      const errorMsg = `An exception occurred: ${error}`;
      console.log(errorMsg);
      await RecordMonitoring({
        name: MONITORING_NAME,
        status: 'error',
        error: errorMsg
      });
    }

    if (onlyOnce) {
      return;
    }

    const sleepTime = RUN_EVERY_MINUTES * 60 * 1000 - (Date.now() - runStartDate);
    if (sleepTime > 0) {
      console.log(`${fnName()}: sleeping ${roundTo(sleepTime / 1000 / 60)} minutes`);
      await sleep(sleepTime);
    }
  }
}

async function computeDataForPair(base, quotes) {
  // const subMarkets = await Promise.all(quotes.map(async (quote) => await computeSubMarket(base, quote)));
  const subMarkets = [];
  for (let quote of quotes) {
    const newSubMarket = await computeSubMarket(base, quote);
    subMarkets.push(newSubMarket);
  }

  let riskLevel = Math.max(...subMarkets.map((_) => _.riskLevel));
  let data = {};
  data[base] = {
    riskLevel: riskLevel,
    subMarkets: subMarkets
  };
  return data;
}

async function computeSubMarket(base, quote) {
  console.log(`computeSubMarket[${base}/${quote}]: starting`);
  const baseConf = getConfTokenBySymbol(base);
  const quoteConf = getConfTokenBySymbol(quote);
  const baseTokenAddress = baseConf.address;
  const quoteTokenAddress = quoteConf.address;
  const protocolDataProviderContract = new ethers.Contract(
    protocolDataProviderAddress,
    protocolDataProviderABI,
    web3Provider
  );

  // if wBETH/USDC, baseReserveCaps is for wBETH
  const baseReserveCaps = await retry(protocolDataProviderContract.getReserveCaps, [baseConf.address]);
  // if wBETH/USDC, quoteReserveCaps is for USDC
  const quoteReserveCaps = await retry(protocolDataProviderContract.getReserveCaps, [quoteConf.address]);
  const reserveDataConfigurationBase = await retry(protocolDataProviderContract.getReserveConfigurationData, [
    baseTokenAddress
  ]);

  const baseTokenInfo = await axios.get(
    'https://coins.llama.fi/prices/current/bsc:' + baseTokenAddress + ',bsc:' + quoteTokenAddress
  );

  let riskLevel = 0.0;

  const liquidationBonusBps = reserveDataConfigurationBase.liquidationBonus.toNumber() - 10000;

  const baseSupplyCapUSD = baseReserveCaps.supplyCap.toNumber() * baseTokenInfo.data.coins['bsc:' + baseTokenAddress].price;
  const quoteBorrowCapUSD = quoteReserveCaps.borrowCap.toNumber() * baseTokenInfo.data.coins['bsc:' + quoteTokenAddress].price;
  const capToUseUsd = Math.min(baseSupplyCapUSD, quoteBorrowCapUSD);
  const liquidationThresholdBps = reserveDataConfigurationBase.liquidationThreshold.toNumber();
  const ltvBps = reserveDataConfigurationBase.ltv.toNumber();

  const { volatility, liquidityInKind } = getLiquidityAndVolatilityFromDashboardData(base, quote, liquidationBonusBps);

  const liquidity = liquidityInKind;
  const liquidityUsd = liquidity * baseTokenInfo.data.coins['bsc:' + baseTokenAddress].price;
  const selectedVolatility = volatility;
  riskLevel = findRiskLevelFromParameters(
    selectedVolatility,
    liquidityUsd,
    liquidationBonusBps / 10000,
    liquidationThresholdBps / 10000,
    capToUseUsd
  );
  const pairValue = {
    quote: quote,
    riskLevel: riskLevel,
    liquidationThreshold: liquidationThresholdBps / 10000,
    LTV: ltvBps / 10000,
    liquidationBonus: liquidationBonusBps / 10000,
    supplyCapUsd: baseSupplyCapUSD,
    supplyCapInKind: baseReserveCaps.supplyCap.toNumber(),
    borrowCapUsd: quoteBorrowCapUSD,
    borrowCapInKind: quoteReserveCaps.borrowCap.toNumber(),
    volatility: selectedVolatility,
    liquidity: liquidity,
    basePrice: baseTokenInfo.data.coins['bsc:' + baseTokenAddress].price,
    quotePrice: baseTokenInfo.data.coins['bsc:' + quoteTokenAddress].price
  };

  console.log(`computeSubMarket[${base}/${quote}]: result:`, pairValue);
  return pairValue;
}

/**
 * 
 * @param {string} base 
 * @param {string} quote 
 * @param {number} liquidationBonusBPS 
 * @returns {{volatility: number, liquidityInKind: number}}
 */
function getLiquidityAndVolatilityFromDashboardData(base, quote, liquidationBonusBPS) {
  const filePath = path.join(DATA_DIR, 'precomputed', 'dashboard', 'pairs', `${base}-${quote}-all.json`);
  const dashboardData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const dataKeys = Object.keys(dashboardData.liquidity);
  const latestKey = dataKeys[dataKeys.length - 1];
  const liquidityData = dashboardData.liquidity[latestKey];
  const volatilityData = liquidityData.volatility;
  const slippageMap = liquidityData.avgSlippageMap;
  return { volatility: volatilityData, liquidityInKind: slippageMap[liquidationBonusBPS] };
}

function findRiskLevelFromParameters(
  volatility /* de la pair */,
  liquidity /* from CSV file à 30 jours (from block to block) */,
  liquidationBonus,
  ltv,
  borrowCap
) {
  const sigma = volatility;
  const d = borrowCap;
  const beta = liquidationBonus;
  const l = liquidity;

  const sigmaTimesSqrtOfD = sigma * Math.sqrt(d);
  const ltvPlusBeta = ltv + beta;
  const lnOneDividedByLtvPlusBeta = Math.log(1 / ltvPlusBeta);
  const lnOneDividedByLtvPlusBetaTimesSqrtOfL = lnOneDividedByLtvPlusBeta * Math.sqrt(l);
  const r = sigmaTimesSqrtOfD / lnOneDividedByLtvPlusBetaTimesSqrtOfL;

  return r;
}

// precomputeRiskLevelKinza();

module.exports = { precomputeRiskLevelKinza };
