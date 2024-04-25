const fs = require('fs');
const path = require('path');
const readline = require('readline');

/**
 * Compute price from normalized reserves
 * @param {number} normalizedFrom
 * @param {number} normalizedTo
 * @returns
 */
function computepancakeswapV2Price(normalizedFrom, normalizedTo) {
  if (normalizedFrom == 0) {
    return 0;
  }
  return normalizedTo / normalizedFrom;
}

async function loadFileLines(filePath) {
  const lines = []; // Array to hold the lines

  // Creating a readable stream
  const readStream = fs.createReadStream(filePath);

  // Creating an instance of readline.Interface
  const rl = readline.createInterface({
    input: readStream,
    crlfDelay: Infinity
  });

  // Promise to handle the line-by-line reading
  const lineReaderPromise = new Promise((resolve, reject) => {
    rl.on('line', (line) => {
      lines.push(line); // Pushing each line to the lines array
    });

    rl.on('close', () => {
      resolve(); // Resolve the promise when reading is complete
    });

    readStream.on('error', (err) => {
      reject(err); // Reject the promise on read error
    });
  });

  // Await for the lineReaderPromise to complete
  await lineReaderPromise;
  return lines; // Return the lines array
}
/**
 * Try to find the univ2 data file for fromSymbol/toSymbol
 * Return all the data we have since fromBlock to toBlock
 * @param {string} DATA_DIR
 * @param {string} fromSymbol
 * @param {string} toSymbol
 * @param {number} fromBlock
 * @param {number} toBlock
 * @returns {Promise<{[blocknumber: number]: {fromReserve: string, toReserve: string}}>}
 */
async function getUniV2DataforBlockInterval(DATA_DIR, fromSymbol, toSymbol, fromBlock, toBlock) {
  const fileInfo = getUniV2DataFile(DATA_DIR, fromSymbol, toSymbol);
  if (!fileInfo) {
    throw new Error(`Could not find pool data for ${fromSymbol}/${toSymbol} on pancakeswapv2`);
  }
  // load the file in RAM
  let fileContent = [];
  if (fs.lstatSync(fileInfo.path).size > 1 * 1024 * 1024 * 1024) {
    fileContent = await loadFileLines(fileInfo.path);
  } else {
    fileContent = fs.readFileSync(fileInfo.path, 'utf-8').split('\n');
  }

  const results = {};
  for (let i = 1; i < fileContent.length - 1; i++) {
    const line = fileContent[i];
    const splitted = line.split(',');
    const blockNumber = Number(splitted[0]);
    if (blockNumber < fromBlock) {
      continue;
    }

    if (blockNumber > toBlock) {
      break;
    }

    results[blockNumber] = {
      fromReserve: fileInfo.reverse ? splitted[2] : splitted[1],
      toReserve: fileInfo.reverse ? splitted[1] : splitted[2]
    };
  }

  return results;
}

/**
 * Return the file found for fromSymbol/toSymbol
 * Example if requesting WETH/USDC and the file is USDC-WETH.csv,
 * this function still returns the USDC-WETH.csv file but specify reverse = true
 * meaning that we should read the reserves as reversed
 * @param {string} dataDir
 * @param {string} fromSymbol
 * @param {string} toSymbol
 * @returns
 */
function getUniV2DataFile(dataDir, fromSymbol, toSymbol) {
  let filePath = path.join(dataDir, 'pancakeswapv2', `${fromSymbol}-${toSymbol}_pancakeswapv2.csv`);
  let reverse = false;

  if (fs.existsSync(filePath)) {
    return {
      path: filePath,
      reverse: reverse
    };
  } else {
    filePath = path.join(dataDir, 'pancakeswapv2', `${toSymbol}-${fromSymbol}_pancakeswapv2.csv`);
    reverse = true;
    if (fs.existsSync(filePath)) {
      return {
        path: filePath,
        reverse: reverse
      };
    } else {
      return null;
    }
  }
}

/**
 * Formula from
 * https://ethereum.stackexchange.com/a/107170/105194
 *  TL;DR:
    a = sqrt(pxy)/p - x
    where p is the target price to be maintained and x and y
    are the quantities of the two tokens in the pool before the trade takes place.
    and a is the amount of x I can sell to reach the price p
 * @param {string} fromSymbol 
 * @param {number} fromReserve must be normalized with correct decimal place
 * @param {string} toSymbol 
 * @param {number} toReserve must be normalized with correct decimal place
 * @param {number} targetSlippage 
 * @returns {{base: number, quote: number}} base amount of token exchangeable for defined slippage, quote amount obtained
 */
function computeLiquidityUniV2Pool(fromReserve, toReserve, targetSlippage) {
  if (fromReserve == 0) {
    return 0;
  }

  const initPrice = toReserve / fromReserve;
  const targetPrice = initPrice - initPrice * targetSlippage;
  const amountOfFromToSell = Math.sqrt(targetPrice * fromReserve * toReserve) / targetPrice - fromReserve;
  const amountOfToObtained = calculateYReceived(fromReserve, toReserve, amountOfFromToSell);
  // const yReceived = calculateYReceived(fromReserve, toReserve, amountOfFromToExchange);
  // const newFromReserve = fromReserve + amountOfFromToExchange;
  // const newToReserve = toReserve - yReceived;
  // const newPrice = newToReserve / newFromReserve;
  // console.log({initPrice});
  // console.log({targetPrice});
  // console.log({newPrice});
  // console.log(`diff wanted: ${targetSlippage * 100}%`);
  // const priceDiff = (initPrice - newPrice) / initPrice;
  // console.log(`real diff for the new price: ${priceDiff*100}%`);
  return { base: amountOfFromToSell, quote: amountOfToObtained };
}

function calculateYReceived(x0, y0, xSell) {
  // Initial state of the liquidity pool
  const k0 = x0 * y0;
  // Calculate the new quantity of asset X after the sale (it increases)
  const x1 = x0 + xSell;
  // Calculate the new quantity of asset Y using the x * y = k formula
  const y1 = k0 / x1;
  // Calculate the difference in asset Y received
  const deltaY = y0 - y1;
  return deltaY;
}

/**
 * Read all the csv files to check what pairs are available
 * @param {string} dataDir
 * @returns {{[base: string]: string[]}}
 */
function getAvailablepancakeswapV2(dataDir) {
  const available = {};
  const files = fs.readdirSync(`${dataDir}/pancakeswapv2/`).filter((_) => _.endsWith('.csv'));
  for (const file of files) {
    const pair = file.split('_')[0];

    const tokenA = pair.split('-')[0];
    const tokenB = pair.split('-')[1];
    if (!available[tokenA]) {
      available[tokenA] = [];
    }
    if (!available[tokenB]) {
      available[tokenB] = [];
    }
    available[tokenA].push(tokenB);
    available[tokenB].push(tokenA);
  }

  return available;
}

module.exports = {
  computepancakeswapV2Price,
  computeLiquidityUniV2Pool,
  getAvailablepancakeswapV2,
  getUniV2DataforBlockInterval
};
