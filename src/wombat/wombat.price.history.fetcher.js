const { ethers, Contract } = require('ethers');
const dotenv = require('dotenv');
const { GetContractCreationBlockNumber } = require('../utils/web3.utils');
const wombatConfig = require('./wombat.config');
const fs = require('fs');
const path = require('path');
const { sleep, fnName, roundTo } = require('../utils/utils');

const { RecordMonitoring } = require('../utils/monitoring');
const { DATA_DIR } = require('../utils/constants');
const { normalize } = require('../utils/token.utils');

dotenv.config();
const RPC_URL = process.env.WOMBAT_PRICE_RPC_URL;
const STEP_MAX = Number(process.env.WOMBAT_STEP_MAX) || Number.MAX_SAFE_INTEGER;

const runnerName = 'Wombat Price Fetcher';
const runEverySec = 60 * 60;

async function wombatPriceHistoryFetcher(onlyOnce = false) {
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

      if (!fs.existsSync(path.join(DATA_DIR, 'precomputed', 'price', 'wombat'))) {
        fs.mkdirSync(path.join(DATA_DIR, 'precomputed', 'price', 'wombat'), { recursive: true });
      }

      const web3Provider = new ethers.providers.StaticJsonRpcProvider(RPC_URL);

      const currentBlock = (await web3Provider.getBlockNumber()) - 10;
      const promises = [];
      for (const fetchConfig of wombatConfig.wombatPricePairs) {
        console.log(`Starting price fetch for ${fetchConfig.poolName}`);
        promises.push(FetchPriceHistory(fetchConfig, currentBlock, web3Provider));
        await sleep(2000);
      }

      await Promise.all(promises);

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

/**
 *
 * @param {{poolAddress: string, poolName: string, tokens: {symbol: string, address: string}[],pairs: {token0: string,token1: string}[]}} fetchConfig
 * @param {*} currentBlock
 * @param {*} web3Provider
 * @returns
 */
async function FetchPriceHistory(fetchConfig, currentBlock, web3Provider) {
  console.log(
    `[${fetchConfig.poolName}]: Start fetching history for pairs ${fetchConfig.pairs
      .map((_) => `${_.token0}-${_.token1}`)
      .join(',')}`
  );
  let startBlock = 0;

  const lastFetchFileName = path.join(
    DATA_DIR,
    'precomputed',
    'price',
    'wombat',
    `${fetchConfig.poolName}-lastfetch.json`
  );

  if (fs.existsSync(lastFetchFileName)) {
    const lastFetchData = JSON.parse(fs.readFileSync(lastFetchFileName));
    startBlock = lastFetchData.lastBlockFetched + 1;
  } else {
    // by default, fetch since contract creation
    startBlock = await GetContractCreationBlockNumber(web3Provider, fetchConfig.poolAddress);
    startBlock += 100_000; // leave 100k blocks ~2 weeks after pool creation because many pools starts with weird data
    // clear the CSV if any
    for (const pair of fetchConfig.pairs) {
      fs.rmSync(
        path.join(DATA_DIR, 'precomputed', 'price', 'wombat', `${pair.token0}-${pair.token1}-unified-data.csv`),
        { force: true }
      );
      fs.rmSync(
        path.join(DATA_DIR, 'precomputed', 'price', 'wombat', `${pair.token1}-${pair.token0}-unified-data.csv`),
        { force: true }
      );
    }
  }

  // fetch all blocks where an event occured since startBlock
  const wombatContract = new Contract(fetchConfig.poolAddress, fetchConfig.abi, web3Provider);

  let priceData = initPriceData(fetchConfig);

  let fromBlock = startBlock;
  let blockStep = 10_000;
  let nextSaveBlock = fromBlock + 100_000; // save data every 100k blocks
  while (fromBlock <= currentBlock) {
    let toBlock = Math.min(currentBlock, fromBlock + blockStep - 1);

    try {
      const events = await wombatContract.queryFilter('Swap', fromBlock, toBlock);

      console.log(
        `${fnName()}[${fetchConfig.poolName}]: [${fromBlock} - ${toBlock}] found ${events.length} events (fetched ${
          toBlock - fromBlock + 1
        } blocks)`
      );

      if (events.length != 0) {
        for (const e of events) {
          // const baseIndex = e.args.fromAmount.toNumber();
          // const quoteIndex = e.args.toAmount.toNumber();

          // find the tokens
          const baseToken = fetchConfig.tokens.find((token) => token.address == e.args.fromToken);

          // if (baseToken == undefined) {
          //   console.log('Token with address ' + e.args.fromToken + ' unkown');
          // }

          const quoteToken = fetchConfig.tokens.find((token) => token.address == e.args.toToken);

          // if (quoteToken == undefined) {
          //   console.log('Token with address ' + e.args.toToken + ' unkown');
          // }

          if (!baseToken || !quoteToken) {
            continue;
          }

          // check if in the list of pair to get
          // if baseToken = USDC and quoteToken = DAI
          // then we search for a pair token0:DAI,token1:USDC or token0:USDC,token1:DAI
          if (
            fetchConfig.pairs.some(
              (_) =>
                (_.token0 == baseToken.symbol && _.token1 == quoteToken.symbol) ||
                (_.token0 == quoteToken.symbol && _.token1 == baseToken.symbol)
            )
          ) {
            const tokenSold = normalize(e.args.fromAmount, baseToken.decimals);
            const tokenBought = normalize(e.args.toAmount, quoteToken.decimals);

            // ignore trades too low
            if (tokenSold < baseToken.dustAmount || tokenBought < quoteToken.dustAmount) {
              continue;
            }

            // Example for WETH/USDC
            // if I sell 1.3 WETH and get 1800 USDC
            // then WETH/USDC price is 1800/1.3 = 1384,6
            // and USDC/WETH is 1.3/1800 7,22...e-4
            const baseQuotePrice = tokenBought / tokenSold;
            const quoteBasePrice = tokenSold / tokenBought;

            priceData[`${baseToken.symbol}-${quoteToken.symbol}`].push({
              block: e.blockNumber,
              price: baseQuotePrice
            });
            priceData[`${quoteToken.symbol}-${baseToken.symbol}`].push({
              block: e.blockNumber,
              price: quoteBasePrice
            });
          }
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

      if (blockStep >= STEP_MAX) {
        blockStep = STEP_MAX;
      }

      fromBlock = toBlock + 1;

      if (nextSaveBlock <= fromBlock) {
        savePriceData(priceData);
        const lastFetchData = { lastBlockFetched: fromBlock - 1 };
        fs.writeFileSync(lastFetchFileName, JSON.stringify(lastFetchData, null, 2));
        priceData = initPriceData(fetchConfig);
        nextSaveBlock = fromBlock + 100_000;
      }
    } catch (e) {
      console.log('Error fetching events:', e);
      blockStep = Math.round(blockStep / 2);
      if (blockStep < 1000) {
        blockStep = 1000;
      }
      toBlock = 0;
      await sleep(2000);
      continue;
    }
  }

  savePriceData(priceData);

  const lastFetchData = { lastBlockFetched: currentBlock };
  fs.writeFileSync(lastFetchFileName, JSON.stringify(lastFetchData, null, 2));
  console.log(`Ending price fetch for ${fetchConfig.poolName}`);
}

function initPriceData(fetchConfig) {
  const priceData = {};
  for (const pair of fetchConfig.pairs) {
    priceData[`${pair.token0}-${pair.token1}`] = [];
    priceData[`${pair.token1}-${pair.token0}`] = [];
  }

  return priceData;
}

function savePriceData(priceData) {
  for (const pair of Object.keys(priceData)) {
    // console.log(`saving data for pair ${pair}`);
    const fileName = path.join(DATA_DIR, 'precomputed', 'price', 'wombat', `${pair}-unified-data.csv`);
    if (!fs.existsSync(fileName)) {
      fs.writeFileSync(fileName, 'blocknumber,price\n');
    }

    const toWrite = [];
    for (const p of priceData[pair]) {
      toWrite.push(`${p.block},${p.price}\n`);
    }

    fs.appendFileSync(fileName, toWrite.join(''));
  }
}

// wombatPriceHistoryFetcher();

module.exports = { wombatPriceHistoryFetcher };
