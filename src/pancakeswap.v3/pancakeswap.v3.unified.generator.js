const path = require('path');
const fs = require('fs');
const { fnName, readLastLine } = require('../utils/utils');
const { getAvailablepancakeswapV3, getUniV3DataforBlockInterval } = require('./pancakeswap.v3.utils');
const { DATA_DIR, BLOCK_PER_DAY } = require('../utils/constants');
const { truncateUnifiedFiles } = require('../data.interface/unified.truncator');

async function generateUnifiedFileUniv3(endBlock) {
  const available = getAvailablepancakeswapV3(DATA_DIR);

  if (!fs.existsSync(path.join(DATA_DIR, 'precomputed', 'pancakeswapv3'))) {
    fs.mkdirSync(path.join(DATA_DIR, 'precomputed', 'pancakeswapv3'), { recursive: true });
  }

  const blockLastYear = endBlock - (BLOCK_PER_DAY * 365);
  for (const base of Object.keys(available)) {
    for (const quote of available[base]) {
      await createUnifiedFileForPair(endBlock, base, quote, blockLastYear);
    }
  }

  truncateUnifiedFiles('pancakeswapv3', blockLastYear);
}

async function createUnifiedFileForPair(endBlock, fromSymbol, toSymbol, blockLastYear) {
  console.log(`${fnName()}: create/append for ${fromSymbol} ${toSymbol}`);
  const unifiedFilename = `${fromSymbol}-${toSymbol}-unified-data.csv`;
  const unifiedFullFilename = path.join(DATA_DIR, 'precomputed', 'pancakeswapv3', unifiedFilename);
  let sinceBlock = 0;
  if (!fs.existsSync(unifiedFullFilename)) {
    fs.writeFileSync(unifiedFullFilename, 'blocknumber,price,slippagemap\n');
  } else {
    const lastLine = await readLastLine(unifiedFullFilename);
    sinceBlock = Number(lastLine.split(',')[0]) + 1;
    if (isNaN(sinceBlock)) {
      sinceBlock = blockLastYear;
    }
  }

  const allData = getUniV3DataforBlockInterval(DATA_DIR, fromSymbol, toSymbol, sinceBlock, endBlock);
  const toWrite = [];
  for (const [blockNumber, data] of Object.entries(allData)) {
    if (blockNumber < sinceBlock) {
      continue;
    }
    if (blockNumber > endBlock) {
      break;
    }

    toWrite.push(`${blockNumber},${data.price},${JSON.stringify(data.slippageMap)}\n`);
  }

  if (toWrite.length == 0) {
    console.log(`${fnName()}: nothing to add to file`);
  } else {
    fs.appendFileSync(unifiedFullFilename, toWrite.join(''));
  }
}

// generateUnifiedFileUniv3(18383558);

module.exports = { generateUnifiedFileUniv3 };
