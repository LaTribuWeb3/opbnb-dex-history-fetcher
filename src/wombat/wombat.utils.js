const { DATA_DIR } = require('../utils/constants');
const fs = require('fs');
const path = require('path');
const CoreV2 = require('./wombat.core.v2');
const { default: BigNumber } = require('bignumber.js');
const { normalize } = require('../utils/token.utils');
const { wombatPools } = require('./wombat.config');

function wombatGetAddressBySymbol(tokens, symbol) {
  const token = tokens.find((token) => token.symbol === symbol);
  return token ? token.address : 'Token not found';
}

async function findValidBlockTag(poolContract, startBlock, endBlock) {
  console.log(`Starting search for valid block tag between ${startBlock} and ${endBlock}.`);

  // Check if the call succeeds with the startBlock immediately
  try {
    await poolContract.endCovRatio({ blockTag: startBlock });
    console.log(`Call succeeded for startBlock ${startBlock}, returning as valid block tag.`);
    return startBlock; // If the call succeeds, return startBlock as it's already valid
  } catch (error) {
    console.log(`Call failed for startBlock ${startBlock}, proceeding with binary search.`);
  }

  let left = startBlock + 1; // Start the search from the next block after startBlock
  let right = endBlock;
  let mid;
  let validBlockTag = -1;

  while (left <= right) {
    mid = Math.floor((left + right) / 2);
    console.log(`Attempting call with blockTag ${mid}.`);
    try {
      await poolContract.endCovRatio({ blockTag: mid });
      console.log(`Call succeeded for blockTag ${mid}.`);
      validBlockTag = mid; // If the call succeeds, store mid as a potential answer
      right = mid - 1; // and try to find a smaller value
      console.log(`Adjusting search range to [${left}, ${right}].`);
    } catch (error) {
      console.log(`Call failed for blockTag ${mid}, discarding left half.`);
      left = mid + 1; // If the call fails, discard the left half and proceed with the right half
      console.log(`Adjusting search range to [${left}, ${right}].`);
    }
  }

  if (validBlockTag !== -1) {
    console.log(`Found valid block tag: ${validBlockTag}.`);
  } else {
    console.log(`No valid block tag found between ${startBlock} and ${endBlock}.`);
  }

  return validBlockTag; // This will be the smallest value of i for which the call does not fail
}

function updateWombatPoolConfig(key, value) {
  const filePath = path.join(DATA_DIR, 'wombat', 'wombat-pool-config.json');

  let currentData = {};

  // Check if the file exists before trying to read it
  if (fs.existsSync(filePath)) {
    // Read the existing file synchronously
    const data = fs.readFileSync(filePath, 'utf8');
    try {
      currentData = JSON.parse(data);
    } catch (parseErr) {
      console.error('Error parsing the pool starting block config.', parseErr);
      return;
    }
  } else {
    console.log('File does not exist, creating a new one.');
  }

  // Add or update the key-value pair
  currentData[key] = value;

  // Convert the updated object back to a JSON string
  const jsonData = JSON.stringify(currentData, null, 2);

  // Write the updated JSON string back to the file synchronously
  try {
    fs.writeFileSync(filePath, jsonData, 'utf8');
    console.log('The pool config has successfully been updated with its starting block value.');
  } catch (writeErr) {
    console.error('An error occurred while updating the pool config with its starting block value', writeErr);
  }
}

function readWombatPoolStartBlock(poolAddress) {
  try {
    const filePath = path.join(DATA_DIR, 'wombat', 'wombat-pool-config.json');
    // Read the file contents synchronously
    if (!fs.existsSync(filePath)) {
      console.log('The pool config file does not exist yet.');
      return undefined;
    }
    const data = fs.readFileSync(filePath, 'utf8');
    const currentData = JSON.parse(data);

    // Check if the key exists and return its value
    if (poolAddress in currentData) {
      return currentData[poolAddress];
    } else {
      return undefined; // Key not found
    }
  } catch (err) {
    console.error('An error occurred while reading or parsing the pool config :', err);
    return undefined; // Return undefined to indicate failure or absence of the key
  }
}

/**
 *
 * @param {BigNumber} baseQty
 * @param {number} targetPrice
 * @param {BigNumber} Ax cash from
 * @param {BigNumber} Ay cash to
 * @param {BigNumber} Lx liability from
 * @param {BigNumber} Ly liability to
 * @param {BigNumber} amplificationFactor
 * @param {BigNumber} startCovRatio
 * @param {BigNumber} endCovRatio
 * @param {BigNumber} haircurRate
 * @returns
 */
function computeLiquidityForSlippageWombatPool(
  baseQty,
  targetPrice,
  Ax,
  Ay,
  Lx,
  Ly,
  amplificationFactor,
  startCovRatio,
  endCovRatio,
  haircutRate
) {
  const coreV2 = new CoreV2();

  Ax = new BigNumber(Ax);
  Ay = new BigNumber(Ay);
  Lx = new BigNumber(Lx);
  Ly = new BigNumber(Ly);
  baseQty = new BigNumber(baseQty);
  amplificationFactor = new BigNumber(amplificationFactor);
  haircutRate = new BigNumber(haircutRate);
  startCovRatio = new BigNumber(startCovRatio);
  endCovRatio = new BigNumber(endCovRatio);

  let low = undefined;
  let high = undefined;
  let lowTo = undefined;
  let highTo = undefined;
  let qtyFrom = baseQty.times(2);
  const exitBoundsDiff = 0.1 / 100; // exit binary search when low and high bound have less than this amount difference
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const qtyToResp = coreV2._HighCovRatioFeePoolV2QuoteFromSafe(
      Ax,
      Ay,
      Lx,
      Ly,
      qtyFrom,
      amplificationFactor,
      haircutRate,
      startCovRatio,
      endCovRatio
    );

    if (qtyToResp.actualToAmount.gt(0)) {
      const qtyTo = qtyToResp.actualToAmount;

      // selling x for y mean more X and less y
      const updatedAx = Ax.plus(qtyFrom);
      const updatedAy = Ay.minus(qtyTo);

      // get the new price for 1e18 (the min value for wombat pool)
      const newQtyToResp = coreV2._HighCovRatioFeePoolV2QuoteFromSafe(
        updatedAx,
        updatedAy,
        Lx,
        Ly,
        new BigNumber(10).pow(18),
        amplificationFactor,
        haircutRate,
        startCovRatio,
        endCovRatio
      );
      const newQtyTo = newQtyToResp.actualToAmount;
      const normalizedFrom = 1;
      const normalizedTo = normalize(newQtyTo.toString(10), 18);
      const currentPrice = normalizedTo / normalizedFrom;
      const variation = Number(high) / Number(low) - 1;
      // console.log(
      //   `Qty: [${low ? normalize(low.toString(10), 18) : '0'} <-> ${
      //     high ? normalize(high.toString(10), 18) : '+∞'
      //   }]. Current price: 1 X = ${currentPrice} Y, targetPrice: ${targetPrice}. Try qty: ${normalizedFrom} X = ${normalizedTo} Y. variation: ${
      //     variation * 100
      //   }%`
      // );

      if (low && high) {
        if (variation < exitBoundsDiff) {
          const base = high.plus(low).div(2);
          const quote = highTo.plus(lowTo).div(2);
          return { base, quote };
        }
      }

      if (currentPrice > targetPrice) {
        // current price too high, must increase qtyFrom
        low = qtyFrom;
        lowTo = qtyTo;

        if (!high) {
          // if high is undefined, just double next try qty
          qtyFrom = qtyFrom.times(2);
        } else {
          // qtyFrom = qtyFrom + (high - low) / 2n;
          qtyFrom = qtyFrom.plus(high.minus(low).div(2));
        }
      } else {
        // current price too low, must decrease qtyFrom
        high = qtyFrom;
        highTo = qtyTo;

        if (!low) {
          // if low is undefined, next try qty = qty / 2
          // qtyFrom = qtyFrom / 2n;
          qtyFrom = qtyFrom.div(2);
        } else {
          qtyFrom = qtyFrom.minus(high.minus(low).div(2));
        }
      }
    } else {
      // if qtyTo is 0, wombat returned an error meaning qtyFrom was too high
      high = qtyFrom;
      // qtyFrom = new BigNumber(1).pow(18);
      if (!low) {
        // if low is undefined, next try qty = qty / 2
        // qtyFrom = qtyFrom / 2n;
        qtyFrom = qtyFrom.div(2);
      } else {
        qtyFrom = qtyFrom.minus(high.minus(low).div(2));
      }
    }
  }
}

/**
 *
 * @param {BigNumber} baseQty
 * @param {number} targetPrice
 * @param {BigNumber} Ax cash from
 * @param {BigNumber} Ay cash to
 * @param {BigNumber} Lx liability from
 * @param {BigNumber} Ly liability to
 * @param {BigNumber} amplificationFactor
 * @param {BigNumber} startCovRatio
 * @param {BigNumber} endCovRatio
 * @param {BigNumber} haircurRate
 * @returns
 */
function computeLiquidityForAvgSlippageWombatPool(
  baseQty,
  targetPrice,
  Ax,
  Ay,
  Lx,
  Ly,
  amplificationFactor,
  startCovRatio,
  endCovRatio,
  haircutRate
) {
  const coreV2 = new CoreV2();

  Ax = new BigNumber(Ax);
  Ay = new BigNumber(Ay);
  Lx = new BigNumber(Lx);
  Ly = new BigNumber(Ly);
  baseQty = new BigNumber(baseQty);
  amplificationFactor = new BigNumber(amplificationFactor);
  haircutRate = new BigNumber(haircutRate);
  startCovRatio = new BigNumber(startCovRatio);
  endCovRatio = new BigNumber(endCovRatio);

  let low = undefined;
  let high = undefined;
  let lowTo = undefined;
  let highTo = undefined;
  let qtyFrom = baseQty.times(2);
  const exitBoundsDiff = 0.1 / 100; // exit binary search when low and high bound have less than this amount difference
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const qtyToResp = coreV2._HighCovRatioFeePoolV2QuoteFromSafe(
      Ax,
      Ay,
      Lx,
      Ly,
      qtyFrom,
      amplificationFactor,
      haircutRate,
      startCovRatio,
      endCovRatio
    );

    if (qtyToResp.actualToAmount.gt(0)) {
      const qtyTo = qtyToResp.actualToAmount;
      const normalizedFrom = normalize(qtyFrom.toString(10), 18);
      const normalizedTo = normalize(qtyTo.toString(10), 18);
      const currentPrice = normalizedTo / normalizedFrom;
      const variation = Number(high) / Number(low) - 1;
      // console.log(
      //   `Qty: [${low ? normalize(low.toString(10), 18) : '0'} <-> ${
      //     high ? normalize(high.toString(10), 18) : '+∞'
      //   }]. Current price: 1 X = ${currentPrice} Y, targetPrice: ${targetPrice}. Try qty: ${normalizedFrom} X = ${normalizedTo} Y. variation: ${
      //     variation * 100
      //   }%`
      // );

      if (low && high) {
        if (variation < exitBoundsDiff) {
          const base = high.plus(low).div(2);
          if (!highTo) {
            highTo = qtyTo;
          }
          const quote = highTo.plus(lowTo).div(2);
          return { base, quote };
        }
      }

      if (currentPrice > targetPrice) {
        // current price too high, must increase qtyFrom
        low = qtyFrom;
        lowTo = qtyTo;

        if (!high) {
          // if high is undefined, just double next try qty
          qtyFrom = qtyFrom.times(2);
        } else {
          // qtyFrom = qtyFrom + (high - low) / 2n;
          qtyFrom = qtyFrom.plus(high.minus(low).div(2));
        }
      } else {
        // current price too low, must decrease qtyFrom
        high = qtyFrom;
        highTo = qtyTo;

        if (!low) {
          // if low is undefined, next try qty = qty / 2
          // qtyFrom = qtyFrom / 2n;
          qtyFrom = qtyFrom.div(2);
        } else {
          qtyFrom = qtyFrom.minus(high.minus(low).div(2));
        }
      }
    } else {
      // if qtyTo is 0, wombat returned an error meaning qtyFrom was too high
      high = qtyFrom;
      // qtyFrom = new BigNumber(1).pow(18);
      if (!low) {
        // if low is undefined, next try qty = qty / 2
        // qtyFrom = qtyFrom / 2n;
        qtyFrom = qtyFrom.div(2);
      } else {
        qtyFrom = qtyFrom.minus(high.minus(low).div(2));
      }
    }
  }
}

function getAvailableWombat() {
  const available = {};

  for (const pool of wombatPools) {
    available[pool.poolName] = {};

    for (const from of pool.tokens) {
      for (const to of pool.tokens) {
        if (from.symbol == to.symbol) {
          continue;
        }
        if (!available[pool.poolName][from.symbol]) {
          available[pool.poolName][from.symbol] = [];
        }
        available[pool.poolName][from.symbol].push(to.symbol);
      }
    }
  }
  return available;
}

/**
 * Extracts and processes CSV data for a given pool, organizing token-related data
 * under a nested 'tokenData' object within each row's representation.
 *
 * @param {Object} pool - An object representing the pool, including its name.
 * @returns {Array<Object>} An array of objects, each representing a row from the CSV,
 * with token data structured under 'tokenData'.
 */
function extractPoolCSV(poolName) {
  // Construct the file path for the pool's CSV file
  const filePath = path.join(DATA_DIR, 'wombat', `${poolName}_wombat.csv`);
  // Read the content of the CSV file synchronously
  const fileContent = fs.readFileSync(filePath, 'utf8');

  // Split the file content into lines, handling both Unix and Windows line endings
  let lines = fileContent.split(/\r?\n/);

  // Discard the last line if it is empty, which is common in many CSV files
  if (lines[lines.length - 1] === '') {
    lines.pop();
  }

  // The first line contains headers, which are extracted and split into an array
  const headers = lines.shift().split(',');

  // Process each subsequent line of the CSV
  const data = lines.map((line) => {
    const values = line.split(',');
    const rowData = headers.reduce((obj, header, index) => {
      // Use a regular expression to identify headers that indicate token-related data
      const tokenMatch = header.match(/(cash|liability)_(\w+)/);
      if (tokenMatch) {
        // Extract the type (cash or liability) and token name from the header
        const [, type, token] = tokenMatch;
        // Ensure the 'tokenData' object exists and then initialize or update
        // the specific token's data within it
        obj.tokenData = obj.tokenData || {};
        obj.tokenData[token] = obj.tokenData[token] || {};
        obj.tokenData[token][type] = values[index];
      } else {
        // For headers not related to tokens, directly assign their values to the row object
        obj[header] = values[index];
      }
      return obj;
    }, {});

    return rowData;
  });

  return data;
}

module.exports = {
  wombatGetAddressBySymbol,
  computeLiquidityForSlippageWombatPool,
  findValidBlockTag,
  readWombatPoolStartBlock,
  updateWombatPoolConfig,
  getAvailableWombat,
  extractPoolCSV,
  computeLiquidityForAvgSlippageWombatPool
};
