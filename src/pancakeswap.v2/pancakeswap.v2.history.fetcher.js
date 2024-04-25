const { ethers } = require('ethers');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const univ2Config = require('./pancakeswap.v2.config');
const { tokens, pairsToFetch } = require('../global.config');
const { GetContractCreationBlockNumber, getBlocknumberForTimestamp } = require('../utils/web3.utils');
const { sleep, fnName, roundTo, readLastLine, retry } = require('../utils/utils');
const { RecordMonitoring } = require('../utils/monitoring');
const { generateUnifiedFileUniv2 } = require('./pancakeswap.v2.unified.generator');
const { DATA_DIR, DEFAULT_STEP_BLOCK } = require('../utils/constants');
const path = require('path');

const RPC_URL = process.env.PANCAKE_V2_RPC_URL;
const STEP_MAX = Number(process.env.PANCAKE_V2_STEP_MAX) || Number.MAX_SAFE_INTEGER;
const MINIMUM_TO_APPEND = process.env.MINIMUM_TO_APPEND || 100;

const runEverySec = 60 * 60;

/**
 * Fetch all liquidity history from pancakeswapV2 pairs
 * The pairs to fetch are read from the config file './pancakeswap.v2.config'
 */
async function pancakeswapV2HistoryFetcher(onlyOnce = false) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const start = Date.now();
    try {
      await RecordMonitoring({
        name: 'pancakeswapV2 Fetcher',
        status: 'running',
        lastStart: Math.round(start / 1000),
        runEvery: runEverySec
      });
      if (!RPC_URL) {
        throw new Error('Could not find RPC_URL env variable');
      }

      if (!fs.existsSync(path.join(DATA_DIR, 'pancakeswapv2'))) {
        fs.mkdirSync(path.join(DATA_DIR, 'pancakeswapv2'), { recursive: true });
      }

      console.log(`${fnName()}: starting`);
      const web3Provider = new ethers.providers.StaticJsonRpcProvider(RPC_URL);
      const currentBlock = (await web3Provider.getBlockNumber()) - 10;
      const minStartDate = Math.round(Date.now() / 1000) - 365 * 2 * 24 * 60 * 60; // min start block is 2y ago
      const minStartBlock = await getBlocknumberForTimestamp(minStartDate);
      const stalePools = [];
      const poolsData = [];
      const promises = [];
      for (const token0 of pairsToFetch) {
        for (const token1 of pairsToFetch) {
          if (token0 == token1) {
            continue;
          }

          if (ignorePool(token0, token1)) {
            console.log(`${fnName()}: Ignoring pool for ${token0}-${token1}`);
            continue;
          }
          const pairKey = `${token0}-${token1}`;
          console.log(`${fnName()}: Start fetching pair ` + pairKey);
          const promise = FetchpancakeswapV2HistoryForPair(
            web3Provider,
            pairKey,
            `${DATA_DIR}/pancakeswapv2/${pairKey}_pancakeswapv2.csv`,
            currentBlock,
            minStartBlock
          );
          promises.push(promise);
          await sleep(500);
        }
      }

      await Promise.all(promises);

      for (const promise of promises) {
        const fetchResult = await promise;
        // mean the pair does not exists on chain
        if (!fetchResult) {
          continue;
        }
        if (fetchResult.isStale) {
          stalePools.push(fetchResult.pairKey);
        }

        const token0Symbol = fetchResult.pairKey.split('-')[0];
        const token1Symbol = fetchResult.pairKey.split('-')[1];
        poolsData.push({
          tokens: [token0Symbol, token1Symbol],
          address: fetchResult.pairAddress,
          label: ''
        });
      }

      if (stalePools.length > 0) {
        console.warn(`Stale pools: ${stalePools.join(',')}`);
      }

      const fetcherResult = {
        dataSourceName: 'pancakeswapv2',
        lastBlockFetched: currentBlock,
        lastRunTimestampMs: Date.now(),
        poolsFetched: poolsData
      };

      fs.writeFileSync(
        path.join(DATA_DIR, 'pancakeswapv2', 'pancakeswapv2-fetcher-result.json'),
        JSON.stringify(fetcherResult, null, 2)
      );

      await generateUnifiedFileUniv2(currentBlock);
      console.log('pancakeswapV2HistoryFetcher: ending');

      const runEndDate = Math.round(Date.now() / 1000);
      await RecordMonitoring({
        name: 'pancakeswapV2 Fetcher',
        status: 'success',
        lastEnd: runEndDate,
        lastDuration: runEndDate - Math.round(start / 1000),
        lastBlockFetched: currentBlock
      });
    } catch (error) {
      const errorMsg = `An exception occurred: ${error}`;
      console.log(errorMsg);
      await RecordMonitoring({
        name: 'pancakeswapV2 Fetcher',
        status: 'error',
        error: errorMsg
      });
    }

    if (onlyOnce) {
      return;
    }
    // sleep 10 min - time it took to run the loop
    // if the loop took more than 10 minutes, restart directly
    const sleepTime = runEverySec * 1000 - (Date.now() - start);
    if (sleepTime > 0) {
      console.log(`${fnName()}: sleeping ${roundTo(sleepTime / 1000 / 60)} minutes`);
      await sleep(sleepTime);
    }
  }
}

// ignore a number of pool because they are empty and are taking a lot of time to fetch FOR NOTHING
function ignorePool(token0, token1) {
  const tokensToIgnore = ['lisUSD', 'SnBNB'];
  if (tokensToIgnore.includes(token0) || tokensToIgnore.includes(token1)) {
    return true;
  }

  switch (`${token0}-${token1}`) {
    default:
      return false;
    case 'lisUSD-BTCB':
    case 'wBETH-WBNB':
    case 'BTCB-FDUSD':
    case 'WBNB-FDUSD':
    case 'SnBNB-WBNB':
    case 'USDT-FDUSD':
    case 'lisUSD-USDC':
    case 'TUSD-WBNB':
    case 'ETH-wBETH':
    case 'TUSD-USDT':
    case 'lisUSD-USDT':
    case 'SnBNB-USDT':
    case 'USDT-SnBNB':
      return true;
  }
}

/**
 * Fetches all history for a pancakeswap v2 pair (a pool)
 * Store the results into a csv file, and use the file as start for a run
 * if the file does not exists, create it and start at the contract deploy block
 * if the file exists, start at the last block fetched + 1
 * @param {ethers.providers.BaseProvider} web3Provider
 * @param {string} pairKey
 * @returns {bool} if the pool is stale (no new data since 500k blocks)
 */
async function FetchpancakeswapV2HistoryForPair(web3Provider, pairKey, historyFileName, currentBlock, minStartBlock) {
  const token0Symbol = pairKey.split('-')[0];
  const token0Address = tokens[token0Symbol].address;
  const token1Symbol = pairKey.split('-')[1];
  const token1Address = tokens[token1Symbol].address;
  const factoryContract = new ethers.Contract(
    univ2Config.pancakeswapV2FactoryAddress,
    univ2Config.pancakeswapV2FactoryABI,
    web3Provider
  );
  const pairAddress = await retry(factoryContract.getPair, [token0Address, token1Address]);

  if (pairAddress == ethers.constants.AddressZero) {
    console.log(`${fnName()}[${pairKey}]: pair does not exist`);
    return undefined;
  }

  const pairContract = new ethers.Contract(pairAddress, univ2Config.pancakeswapV2PairABI, web3Provider);
  const contractToken0 = await retry(pairContract.token0, []);
  if (contractToken0.toLowerCase() != token0Address.toLowerCase()) {
    console.log(`${fnName()}[${pairKey}]: pair does not exist`);
    return undefined;
  }
  const contractToken1 = await retry(pairContract.token1, []);
  if (contractToken1.toLowerCase() != token1Address.toLowerCase()) {
    console.log(`${fnName()}[${pairKey}]: pair does not exist`);
    return undefined;
  }

  const initBlockStep = 10000;

  let startBlock = undefined;
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
  }
  if (!fs.existsSync(historyFileName)) {
    fs.writeFileSync(
      historyFileName,
      `blocknumber,reserve_${token0Symbol}_${token0Address},reserve_${token1Symbol}_${token1Address}\n`
    );
  } else {
    const lastLine = await readLastLine(historyFileName);
    startBlock = Number(lastLine.split(',')[0]) + 1;
  }

  if (!startBlock) {
    const deployBlockNumber = await GetContractCreationBlockNumber(web3Provider, pairAddress);
    startBlock = deployBlockNumber + 100_000; // leave 100k blocks ~2 weeks after pool creation because many pools starts with weird data
  }

  if (startBlock < minStartBlock) {
    startBlock = minStartBlock;
  }
  if (pairAddress == '0xda83f6b25b5b9e2b042fab04067e0fadfa106135') {
    startBlock = 36095531;
  }

  console.log(
    `${fnName()}[${pairKey}]: start fetching data for ${
      currentBlock - startBlock
    } blocks to reach current block: ${currentBlock}`
  );

  let liquidityValues = [];

  let blockStep = initBlockStep;
  let fromBlock = startBlock;
  let toBlock = 0;
  let cptError = 0;
  let lastEventBlock = startBlock;
  let lastBlockSaved = 0;

  while (toBlock < currentBlock) {
    toBlock = fromBlock + blockStep - 1;
    if (toBlock > currentBlock) {
      toBlock = currentBlock;
    }

    let events = undefined;
    try {
      events = await pairContract.queryFilter('Sync', fromBlock, toBlock);
    } catch (e) {
      // console.log(`query filter error: ${e.toString()}`);
      blockStep = Math.max(10, Math.round(blockStep / 2));
      toBlock = 0;
      cptError++;
      if (cptError >= 100) {
        throw new Error('Too many errors');
      }
      await sleep(1000);
      continue;
    }

    console.log(
      `${fnName()}[${pairKey}]: [${fromBlock} - ${toBlock}] found ${
        events.length
      } Sync events after ${cptError} errors (fetched ${toBlock - fromBlock + 1} blocks)`
    );
    cptError = 0;

    const values = {};

    if (events.length > 0) {
      for (const event of events) {
        if (event.blockNumber > lastBlockSaved + DEFAULT_STEP_BLOCK) {
          lastBlockSaved = event.blockNumber;
          values[event.blockNumber] = {
            r0: event.args.reserve0.toString(),
            r1: event.args.reserve1.toString()
          };
        }
      }

      for (const [block, data] of Object.entries(values)) {
        liquidityValues.push({
          block: block,
          r0: data.r0,
          r1: data.r1
        });
      }

      if (liquidityValues.length >= MINIMUM_TO_APPEND) {
        const textToAppend = liquidityValues.map((_) => `${_.block},${_.r0},${_.r1}`);
        fs.appendFileSync(historyFileName, textToAppend.join('\n') + '\n');
        liquidityValues = [];
      }
      // try to find the blockstep to reach 8000 events per call as the RPC limit is 10 000,
      // this try to change the blockstep by increasing it when the pool is not very used
      // or decreasing it when the pool is very used
      // const newBlockStep = Math.min(1000000, Math.round(blockStep * 8000 / events.length));
      // if(newBlockStep > blockStep*2){
      //     blockStep = blockStep*2;
      // }
      // else{
      //     blockStep = newBlockStep;
      // }

      // blockStep = Math.min(maxStep, blockStep*2);
    }

    blockStep = Math.min(STEP_MAX, blockStep * 2);

    fromBlock = toBlock + 1;
  }

  if (liquidityValues.length > 0) {
    const textToAppend = liquidityValues.map((_) => `${_.block},${_.r0},${_.r1}`);
    fs.appendFileSync(historyFileName, textToAppend.join('\n') + '\n');
  }

  console.log(`${fnName()}[${pairKey}]: END FETCH`);

  // return true if the last event fetched is more than 500k blocks old
  return { pairKey: pairKey, isStale: lastEventBlock < currentBlock - 500_000, pairAddress: pairAddress };
}

// pancakeswapV2HistoryFetcher();

module.exports = { pancakeswapV2HistoryFetcher };
