const { ethers, Contract } = require('ethers');
const dotenv = require('dotenv');
const { GetContractCreationBlockNumber, getBlocknumberForTimestamp } = require('../utils/web3.utils');
const pancakeConfig = require('./pancake.config');
const fs = require('fs');
const path = require('path');
const { sleep, fnName, readLastLine, roundTo, retry } = require('../utils/utils');

const { RecordMonitoring } = require('../utils/monitoring');
// const { generateUnifiedFilepancake } = require('./pancake.unified.generator');
const { DATA_DIR } = require('../utils/constants');
const { providers } = require('@0xsequence/multicall');
const { getConfTokenBySymbol, normalize } = require('../utils/token.utils');
// const { runCurveUnifiedMultiThread } = require('../../scripts/runCurveUnifiedMultiThread');
const { generateUnifiedFilepancake } = require('./pancake.unified.generator');

dotenv.config();
const SAVE_BLOCK_STEP = 1200;
const RPC_URL = process.env.RPC_URL;
const runEverySec = 60 * 60;

const runnerName = 'Pancake Stable Fetcher';
/**
 * the main entrypoint of the script, will run the fetch against all pool in the config
 */
async function pancakeHistoryFetcher(onlyOnce = false) {
  // run the process with 'multi' param to run the unified file generator in multithread
  // const multiThread = process.argv[2] == 'multi' ? true : false;
  // console.log({multiThread});
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const start = Date.now();
    try {
      await RecordMonitoring({
        name: runnerName,
        status: 'running',
        lastStart: Math.round(start / 1000),
        runEvery: runEverySec
      });

      if (!fs.existsSync(path.join(DATA_DIR, 'pancake'))) {
        fs.mkdirSync(path.join(DATA_DIR, 'pancake'), { recursive: true });
      }

      const lastResults = {};
      const web3Provider = new ethers.providers.StaticJsonRpcProvider(RPC_URL);

      const currentBlock = await web3Provider.getBlockNumber();
      const poolsData = [];
      let fetchPromises = [];
      for (const fetchConfig of pancakeConfig.pancakePairs) {
        fetchPromises.push(FetchHistory(fetchConfig, currentBlock, web3Provider));
        await sleep(2000);
      }

      const lastDataResults = await Promise.all(fetchPromises);

      let cpt = 0;
      for (const fetchConfig of pancakeConfig.pancakePairs) {
        const lastData = lastDataResults[cpt];
        lastResults[`${fetchConfig.poolName}`] = lastData;
        const poolData = {
          tokens: [],
          address: fetchConfig.poolAddress,
          label: fetchConfig.poolName
        };
        for (const token of fetchConfig.tokens) {
          poolData.tokens.push(token.symbol);
        }

        poolsData.push(poolData);
        cpt++;
      }

      const poolSummaryFullname = path.join(DATA_DIR, 'pancake', 'pancake_pools_summary.json');
      fs.writeFileSync(poolSummaryFullname, JSON.stringify(lastResults, null, 2));

      const fetcherResult = {
        dataSourceName: 'pancake',
        lastBlockFetched: currentBlock,
        lastRunTimestampMs: Date.now(),
        poolsFetched: poolsData
      };

      fs.writeFileSync(
        path.join(DATA_DIR, 'pancake', 'pancake-fetcher-result.json'),
        JSON.stringify(fetcherResult, null, 2)
      );

      // if(multiThread) {
      // await runCurveUnifiedMultiThread();
      // } else {
      await generateUnifiedFilepancake(currentBlock);
      // }

      const runEndDate = Math.round(Date.now() / 1000);
      await RecordMonitoring({
        name: runnerName,
        status: 'success',
        lastEnd: runEndDate,
        lastDuration: runEndDate - Math.round(start / 1000),
        lastBlockFetched: currentBlock
      });
    } catch (error) {
      const errorMsg = `An exception occurred: ${error}`;
      console.log(errorMsg);
      await RecordMonitoring({
        name: runnerName,
        status: 'error',
        error: errorMsg
      });
    }

    if (onlyOnce) {
      return;
    }
    // sleep 30 min minus time it took to run the loop
    // if the loop took more than 30 minutes, restart directly
    const sleepTime = runEverySec * 1000 - (Date.now() - start);
    if (sleepTime > 0) {
      console.log(`${fnName()}: sleeping ${roundTo(sleepTime / 1000 / 60)} minutes`);
      await sleep(sleepTime);
    }
  }
}

function getpancakeContract(fetchConfig, web3Provider) {
  let pancakeContract = undefined;
  switch (fetchConfig.abi.toLowerCase()) {
    case 'stableswap':
      pancakeContract = new Contract(fetchConfig.poolAddress, pancakeConfig.stableSwapAbi, web3Provider);
      break;
    case 'stableswapfactory':
      pancakeContract = new Contract(fetchConfig.poolAddress, pancakeConfig.stableSwapFactoryAbi, web3Provider);
      break;
    case 'pancakepool':
      pancakeContract = new Contract(fetchConfig.poolAddress, pancakeConfig.pancakePoolAbi, web3Provider);
      break;
    case 'susdpool':
      pancakeContract = new Contract(fetchConfig.poolAddress, pancakeConfig.susdpancakePoolAbi, web3Provider);
      break;
    case 'tricryptov2':
      pancakeContract = new Contract(fetchConfig.poolAddress, pancakeConfig.triCryptov2Abi, web3Provider);
      break;
    case 'tricryptov2factory':
      pancakeContract = new Contract(fetchConfig.poolAddress, pancakeConfig.tricryptoFactoryAbi, web3Provider);
      break;
    case 'cryptov2':
      pancakeContract = new Contract(fetchConfig.poolAddress, pancakeConfig.cryptov2Abi, web3Provider);
      break;
    case 'pancakestableswaptwopoolabi':
      pancakeContract = new Contract(fetchConfig.poolAddress, pancakeConfig.pancakeStableSwapTwoPoolAbi, web3Provider);
      break;
    default:
      throw new Error(`Unknown abi: ${fetchConfig.abi}`);
  }

  return pancakeContract;
}

function getpancakeTopics(pancakeContract, fetchConfig) {
  let topics = [];

  switch (fetchConfig.abi.toLowerCase()) {
    case 'stableswap':
      topics = [
        pancakeContract.filters.TokenExchange().topics[0],
        pancakeContract.filters.TokenExchangeUnderlying().topics[0],
        pancakeContract.filters.AddLiquidity().topics[0],
        pancakeContract.filters.RemoveLiquidity().topics[0],
        pancakeContract.filters.RemoveLiquidityOne().topics[0],
        pancakeContract.filters.RemoveLiquidityImbalance().topics[0],
        pancakeContract.filters.RampA().topics[0],
        pancakeContract.filters.StopRampA().topics[0]
      ];
      break;
    case 'pancakestableswaptwopoolabi':
      topics = [
        pancakeContract.filters.TokenExchange().topics[0],
        pancakeContract.filters.AddLiquidity().topics[0],
        pancakeContract.filters.RemoveLiquidity().topics[0],
        pancakeContract.filters.RemoveLiquidityOne().topics[0],
        pancakeContract.filters.RemoveLiquidityImbalance().topics[0],
        pancakeContract.filters.RampA().topics[0],
        pancakeContract.filters.StopRampA().topics[0]
      ];
      break;
    case 'stableswapfactory':
      topics = [
        pancakeContract.filters.Transfer().topics[0],
        pancakeContract.filters.Approval().topics[0],
        pancakeContract.filters.TokenExchange().topics[0],
        pancakeContract.filters.AddLiquidity().topics[0],
        pancakeContract.filters.RemoveLiquidity().topics[0],
        pancakeContract.filters.RemoveLiquidityOne().topics[0],
        pancakeContract.filters.RemoveLiquidityImbalance().topics[0],
        pancakeContract.filters.RampA().topics[0]
      ];
      break;
    case 'pancakepool':
      topics = [
        pancakeContract.filters.TokenExchange().topics[0],
        pancakeContract.filters.AddLiquidity().topics[0],
        pancakeContract.filters.RemoveLiquidity().topics[0],
        pancakeContract.filters.RemoveLiquidityOne().topics[0],
        pancakeContract.filters.RemoveLiquidityImbalance().topics[0],
        pancakeContract.filters.RampA().topics[0],
        pancakeContract.filters.StopRampA().topics[0]
      ];
      break;
    case 'susdpool':
      topics = [
        pancakeContract.filters.TokenExchange().topics[0],
        pancakeContract.filters.TokenExchangeUnderlying().topics[0],
        pancakeContract.filters.AddLiquidity().topics[0],
        pancakeContract.filters.RemoveLiquidity().topics[0],
        pancakeContract.filters.RemoveLiquidityImbalance().topics[0],
        pancakeContract.filters.NewParameters().topics[0],
        pancakeContract.filters.CommitNewParameters().topics[0]
      ];
      break;
    case 'tricryptov2':
      topics = [
        pancakeContract.filters.TokenExchange().topics[0],
        pancakeContract.filters.AddLiquidity().topics[0],
        pancakeContract.filters.RemoveLiquidity().topics[0],
        pancakeContract.filters.RemoveLiquidityOne().topics[0],
        pancakeContract.filters.NewParameters().topics[0],
        pancakeContract.filters.CommitNewParameters().topics[0],
        pancakeContract.filters.RampAgamma().topics[0]
      ];
      break;

    case 'tricryptov2factory':
      topics = [
        pancakeContract.filters.TokenExchange().topics[0],
        pancakeContract.filters.AddLiquidity().topics[0],
        pancakeContract.filters.RemoveLiquidity().topics[0],
        pancakeContract.filters.RemoveLiquidityOne().topics[0],
        pancakeContract.filters.NewParameters().topics[0],
        pancakeContract.filters.CommitNewParameters().topics[0],
        pancakeContract.filters.RampAgamma().topics[0]
      ];
      break;
    case 'cryptov2':
      topics = [
        pancakeContract.filters.TokenExchange().topics[0],
        pancakeContract.filters.AddLiquidity().topics[0],
        pancakeContract.filters.RemoveLiquidity().topics[0],
        pancakeContract.filters.RemoveLiquidityOne().topics[0],
        pancakeContract.filters.NewParameters().topics[0],
        pancakeContract.filters.CommitNewParameters().topics[0],
        pancakeContract.filters.RampAgamma().topics[0]
      ];
      break;

    default:
      throw new Error(`Unknown abi: ${fetchConfig.abi}`);
  }

  return topics;
}
/**
 * Takes a fetchConfig from pancake.config.js and outputs liquidity file in /data
 * @param {{poolAddress: string, poolName: string, version: number, abi: string, ampFactor: number, additionnalTransferEvents: {[symbol: string]: string[]}}} fetchConfig
 * @param {number} currentBlock
 * @param {StaticJsonRpcProvider} web3Provider
 */
async function FetchHistory(fetchConfig, currentBlock, web3Provider) {
  console.log(`[${fetchConfig.poolName}]: Start fetching history`);
  const historyFileName = path.join(DATA_DIR, 'pancake', `${fetchConfig.poolName}_pancake.csv`);
  let startBlock = 0;

  if (fs.existsSync(historyFileName)) {
    const lastLine = await readLastLine(historyFileName);
    startBlock = Number(lastLine.split(',')[0]) + 1;
  } else {
    // by default, fetch for the last 380 days (a bit more than 1 year)
    // const creationBlock = GetContractCreationBlockNumber(fetchConfig.poolAddress, web3Provider);
    const startDate = Math.round(Date.now() / 1000) - 323 * 24 * 60 * 60;
    startBlock = await getBlocknumberForTimestamp(startDate);
    // startBlock = oneYearAgo > creationBlock ? oneYearAgo : creationBlock;
  }

  // this is done for the tricryptoUSDC pool because the first liquidity values are too low for
  // the liquidity algorithm to work. Dunno why
  if (fetchConfig.minBlock && startBlock < fetchConfig.minBlock) {
    startBlock = fetchConfig.minBlock;
  }

  // fetch all blocks where an event occured since startBlock
  const pancakeContract = getpancakeContract(fetchConfig, web3Provider);
  const topics = getpancakeTopics(pancakeContract, fetchConfig);

  if (startBlock + 1000000 > currentBlock) {
    currentBlock = startBlock + 1000000;
  }
  const allBlocksWithEvents = await getAllBlocksWithEventsForContractAndTopics(
    fetchConfig,
    startBlock,
    currentBlock,
    pancakeContract,
    topics
  );
  console.log(`[${fetchConfig.poolName}]: found ${allBlocksWithEvents.length} blocks with events since ${startBlock}`);

  if (fetchConfig.isCryptoV2) {
    await fetchReservesDataCryptoV2(fetchConfig, historyFileName, startBlock, web3Provider, allBlocksWithEvents);
    // read the lalst line of the file to return lastData
    const lastLine = await readLastLine(historyFileName);
    const lastData = {};
    for (let i = 0; i < fetchConfig.tokens.length; i++) {
      const tokenSymbol = fetchConfig.tokens[i].symbol;
      const confToken = getConfTokenBySymbol(tokenSymbol);
      const tokenReserve = normalize(lastLine.split(',')[i + 5], confToken.decimals);
      lastData[tokenSymbol] = tokenReserve;
    }

    console.log(`[${fetchConfig.poolName}]: ending mode pancake v2`);
    return lastData;
  } else {
    await fetchReservesData(fetchConfig, historyFileName, startBlock, web3Provider, allBlocksWithEvents);
    // read the lalst line of the file to return lastData
    const lastLine = await readLastLine(historyFileName);
    const lastData = {};
    for (let i = 0; i < fetchConfig.tokens.length; i++) {
      const tokenSymbol = fetchConfig.tokens[i].symbol;
      const confToken = getConfTokenBySymbol(tokenSymbol);
      const tokenReserve = normalize(lastLine.split(',')[i + 3], confToken.decimals);
      lastData[tokenSymbol] = tokenReserve;
    }

    console.log(`[${fetchConfig.poolName}]: ending mode pancake v1`);
    return lastData;
  }
}

async function fetchReservesData(fetchConfig, historyFileName, lastBlock, web3Provider, allBlocksWithEvents) {
  let lastBlockCurrent = lastBlock;
  const multicallProvider = new providers.MulticallProvider(web3Provider);
  const lpTokenContract = new Contract(fetchConfig.lpTokenAddress, pancakeConfig.erc20Abi, multicallProvider);
  const poolContract = getpancakeContract(fetchConfig, multicallProvider);

  if (!fs.existsSync(historyFileName)) {
    let tokensStr = [];
    for (const token of fetchConfig.tokens) {
      tokensStr.push(`reserve_${token.symbol}_${token.address}`);
    }

    fs.writeFileSync(
      historyFileName,
      `blocknumber,ampFactor,lp_supply_${fetchConfig.lpTokenAddress},${tokensStr.join(',')}\n`
    );
  }

  for (const blockNum of allBlocksWithEvents) {
    if (blockNum - SAVE_BLOCK_STEP < lastBlockCurrent) {
      console.log(`fetchReservesData[${fetchConfig.poolName}]: ignoring block ${blockNum}`);
      continue;
    }

    const lineToWrite = await retry(fetchpancakeData, [fetchConfig, blockNum, poolContract, lpTokenContract]);
    fs.appendFileSync(historyFileName, `${blockNum},${lineToWrite}\n`);

    // const A = await poolContract.A({blockTag: blockNum});
    // console.log('A:', A.toString());

    // const supply = await lpTokenContract.totalSupply({blockTag: blockNum});
    // console.log('lpSupply:', supply.toString());
    // for(let i = 0; i < fetchConfig.tokens.length; i++) {
    //     const balance = await poolContract.balances(i, {blockTag: blockNum});
    //     console.log(`${fetchConfig.tokens[i].symbol}: ${balance.toString()}`);
    // }
    lastBlockCurrent = blockNum;
  }
}

async function fetchpancakeData(fetchConfig, blockNum, poolContract, lpTokenContract) {
  console.log(`fetchReservesData[${fetchConfig.poolName}]: Working on block ${blockNum}`);

  const promises = [];
  promises.push(poolContract.A({ blockTag: blockNum }));
  promises.push(lpTokenContract.totalSupply({ blockTag: blockNum }));
  for (let i = 0; i < fetchConfig.tokens.length; i++) {
    promises.push(poolContract.balances(i, { blockTag: blockNum }));
  }

  const promiseResults = await Promise.all(promises);
  const lineToWrite = promiseResults.map((_) => _.toString()).join(',');
  return lineToWrite;
}

async function fetchReservesDataCryptoV2(fetchConfig, historyFileName, lastBlock, web3Provider, allBlocksWithEvents) {
  let lastBlockCurrent = lastBlock;
  const multicallProvider = new providers.MulticallProvider(web3Provider);
  const lpTokenContract = new Contract(fetchConfig.lpTokenAddress, pancakeConfig.erc20Abi, multicallProvider);
  const poolContract = getpancakeContract(fetchConfig, multicallProvider);

  if (!fs.existsSync(historyFileName)) {
    let tokensStr = [];
    for (const token of fetchConfig.tokens) {
      tokensStr.push(`reserve_${token.symbol}`);
    }

    let priceScaleStr = [];
    for (let i = 1; i < fetchConfig.tokens.length; i++) {
      priceScaleStr.push(`price_scale_${fetchConfig.tokens[i].symbol}`);
    }

    fs.writeFileSync(
      historyFileName,
      `blocknumber,ampFactor,gamma,D,lp_supply,${tokensStr.join(',')},${priceScaleStr.join(',')}\n`
    );
  }

  for (const blockNum of allBlocksWithEvents) {
    if (blockNum - SAVE_BLOCK_STEP < lastBlockCurrent) {
      console.log(`fetchReservesData[${fetchConfig.poolName}]: ignoring block ${blockNum}`);
      continue;
    }

    const lineToWrite = await retry(fetchpancakeDataCryptoV2, [fetchConfig, blockNum, poolContract, lpTokenContract]);
    fs.appendFileSync(historyFileName, `${blockNum},${lineToWrite}\n`);
    lastBlockCurrent = blockNum;
  }
}

async function fetchpancakeDataCryptoV2(fetchConfig, blockNum, poolContract, lpTokenContract) {
  console.log(`fetchReservesData[${fetchConfig.poolName}]: Working on block ${blockNum}`);

  const promises = [];
  promises.push(poolContract.A({ blockTag: blockNum }));
  promises.push(poolContract.gamma({ blockTag: blockNum }));
  promises.push(poolContract.D({ blockTag: blockNum }));
  promises.push(lpTokenContract.totalSupply({ blockTag: blockNum }));
  for (let i = 0; i < fetchConfig.tokens.length; i++) {
    promises.push(poolContract.balances(i, { blockTag: blockNum }));
  }

  // when only two crypto, price_scale is not an array, it's a normal field...
  if (fetchConfig.tokens.length == 2) {
    promises.push(poolContract.price_scale({ blockTag: blockNum }));
  } else {
    for (let i = 0; i < fetchConfig.tokens.length - 1; i++) {
      promises.push(poolContract.price_scale(i, { blockTag: blockNum }));
    }
  }

  const promiseResults = await Promise.all(promises);

  const lineToWrite = promiseResults.map((_) => _.toString()).join(',');
  return lineToWrite;
}

async function getAllBlocksWithEventsForContractAndTopics(fetchConfig, startBlock, endBlock, pancakeContract, topics) {
  const blockSet = new Set();

  let fromBlock = startBlock;
  let blockStep = 100000;
  while (fromBlock <= endBlock) {
    let toBlock = Math.min(endBlock, fromBlock + blockStep - 1);

    try {
      const events = await pancakeContract.queryFilter(
        {
          topics: [topics]
        },
        fromBlock,
        toBlock
      );
      console.log(
        `${fnName()}[${fetchConfig.poolName}-${fetchConfig.lpTokenName}]: [${fromBlock} - ${toBlock}] found ${
          events.length
        } events (fetched ${toBlock - fromBlock + 1} blocks)`
      );

      if (events.length != 0) {
        for (const e of events) {
          blockSet.add(e.blockNumber);
        }

        const newBlockStep = Math.min(1_000_000, Math.round((blockStep * 8000) / events.length));
        if (newBlockStep > blockStep * 2) {
          blockStep = blockStep * 2;
        } else {
          blockStep = newBlockStep;
        }
      } else {
        // if 0 events, multiply blockstep by 2
        blockStep = blockStep * 2;
      }

      fromBlock = toBlock + 1;
    } catch (e) {
      // console.log('query filter error:', e);
      blockStep = Math.round(blockStep / 2);
      if (blockStep < 1000) {
        blockStep = 1000;
      }
      toBlock = 0;
      await sleep(2000);
      continue;
    }
  }

  return Array.from(blockSet);
}

// pancakeHistoryFetcher();

module.exports = { pancakeHistoryFetcher };
