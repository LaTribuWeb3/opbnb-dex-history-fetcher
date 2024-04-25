const { ethers, Contract } = require('ethers');
const dotenv = require('dotenv');
const { wombatPools } = require('./wombat.config');
const { DATA_DIR } = require('../utils/constants');
const fs = require('fs');
const path = require('path');
const { readLastLine, sleep } = require('../utils/utils');
const { providers } = require('@0xsequence/multicall');
const { getTokenSymbolByAddress } = require('../utils/token.utils');
const { GetContractCreationBlockNumber } = require('../utils/web3.utils');
const { wombatAbis } = require('../utils/abis');
const { findValidBlockTag, readWombatPoolStartBlock, updateWombatPoolConfig } = require('./wombat.utils');
const { generateUnifiedFileWombat } = require('./wombat.unified.generator');
dotenv.config();

const RPC_URL = process.env.WOMBAT_RPC_URL;
// wombatHistoryFetcher();

async function wombatHistoryFetcher() {
  //check data dir exists
  if (!fs.existsSync(path.join(DATA_DIR, 'wombat'))) {
    fs.mkdirSync(path.join(DATA_DIR, 'wombat'), { recursive: true });
  }

  //instantiate RPC
  const web3Provider = new ethers.providers.StaticJsonRpcProvider(RPC_URL);
  const multicallProvider = new providers.MulticallProvider(web3Provider);
  const currentBlock = (await web3Provider.getBlockNumber()) - 10;

  const promises = [];
  for (const pool of wombatPools) {
    console.log(`Starting ${pool.poolName}`);
    const promise = fetchHistoryForPool(pool, multicallProvider, web3Provider, currentBlock);
    // await promise(); // uncomment to exec sequentially, better for debug
    promises.push(promise);

    await sleep(2000);
  }

  const poolsData = await Promise.all(promises);

  const fetcherResult = {
    dataSourceName: 'wombat',
    lastBlockFetched: currentBlock,
    lastRunTimestampMs: Date.now(),
    poolsFetched: poolsData
  };

  fs.writeFileSync(path.join(DATA_DIR, 'wombat', 'wombat-fetcher-result.json'), JSON.stringify(fetcherResult, null, 2));

  await generateUnifiedFileWombat();
}
async function fetchHistoryForPool(pool, multicallProvider, web3Provider, currentBlock) {
  const poolContract = new Contract(pool.poolAddress, pool.poolAbi, multicallProvider);

  //get poolTokens
  const poolTokens = await poolContract.getTokens();
  //get wombat AssetTokens
  const poolAssets = [];
  for (const token of poolTokens) {
    poolAssets.push(await poolContract.addressOfAsset(token));
  }

  const historyFileName = path.join(DATA_DIR, 'wombat', `${pool.poolName}_wombat.csv`);

  const blockStep = 1200;
  const oneYearInBlocks = 10519200;
  let startBlock = currentBlock - oneYearInBlocks;

  if (fs.existsSync(historyFileName)) {
    const lastLine = await readLastLine(historyFileName);
    const lastLineBlock = Number(lastLine.split(',')[0]) + 1;
    if (!Number.isNaN(lastLineBlock)) {
      startBlock = lastLineBlock + blockStep - 1;
    }
  } else {
    const creationBlock = await GetContractCreationBlockNumber(web3Provider, pool.poolAddress);
    if (startBlock < creationBlock) {
      startBlock = creationBlock + 800_000; // 2 weeks after pool creation
    }

    // find the min block where the archive node call works
    let findBlock = readWombatPoolStartBlock(pool.poolAddress);
    if (!findBlock) {
      findBlock = await findValidBlockTag(poolContract, startBlock, currentBlock);
    }

    // set startBlock as the first block where the archive node call works
    if (startBlock < findBlock) {
      startBlock = findBlock;
    }
    updateWombatPoolConfig(pool.poolAddress, startBlock);
  }

  ///if file does not exist, create it and write headers
  if (!fs.existsSync(historyFileName)) {
    let tokensStr = [];
    for (const token of poolTokens) {
      tokensStr.push(`cash_${getTokenSymbolByAddress(token)}`);
      tokensStr.push(`liability_${getTokenSymbolByAddress(token)}`);
    }

    fs.writeFileSync(
      historyFileName,
      `blocknumber,ampFactor,haircutRate,startCovRatio,endCovRatio,${tokensStr.join(',')}\n`
    );
  }

  const poolAssetsContracts = [];
  for (const tokenAddress of poolAssets) {
    poolAssetsContracts.push(new Contract(tokenAddress, wombatAbis.wombatPoolAssetAbi, multicallProvider));
  }
  for (let i = startBlock; i + blockStep < currentBlock; i += blockStep) {
    const promises = [];
    promises.push(poolContract.ampFactor({ blockTag: i }));
    promises.push(poolContract.haircutRate({ blockTag: i }));
    promises.push(poolContract.startCovRatio({ blockTag: i }));
    promises.push(poolContract.endCovRatio({ blockTag: i }));
    for (const contract of poolAssetsContracts) {
      promises.push(contract.cash({ blockTag: i }));
      promises.push(contract.liability({ blockTag: i }));
    }
    const promisesResults = await Promise.all(promises);
    const lineToWrite = promisesResults.map((_) => _.toString()).join(',');
    fs.appendFileSync(historyFileName, `${i},${lineToWrite}\n`);
  }

  console.log(`Ending ${pool.poolName}`);
  return {
    tokens: pool.tokens,
    address: pool.poolAddress,
    label: pool.poolName
  };
}

module.exports = { wombatHistoryFetcher };
