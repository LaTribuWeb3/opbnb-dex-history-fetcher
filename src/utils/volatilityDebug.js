const fs = require('fs');
const path = require('path');
const { DATA_DIR } = require('./constants');

const directoryPath = path.join(DATA_DIR, 'precomputed', 'price', 'pancakeswapv3');
const percentageChangeThreshold = 10; // Define the percentage change threshold
const shouldDeleteLines = false; // Parameter to determine if lines should be deleted
const fileFilterString = 'USDT'; // Parameter to filter files by name

function isSignificantDeviation(fromValue, toValue, threshold) {
  let percentageVariation = (Math.abs(toValue - fromValue) / fromValue) * 100;
  return percentageVariation >= threshold;
}

function processFile(filePath, shouldDelete) {
  try {
    let data = fs.readFileSync(filePath, 'utf8');
    let lines = data.split('\n').filter((line) => line);
    const originalLineCount = lines.length;

    let objectsArray = lines.slice(1).map((line) => {
      const [timestamp, value] = line.split(',');
      return {
        timestamp,
        value: parseFloat(value)
      };
    });

    let indexesToDelete = [];
    for (let i = 0; i < objectsArray.length - 1; i++) {
      let currentValue = objectsArray[i].value;
      let nextValue = objectsArray[i + 1].value;

      if (isSignificantDeviation(currentValue, nextValue, percentageChangeThreshold)) {
        indexesToDelete.push(i); // Mark current index for deletion
        console.log(
          `Flagged for deletion in ${filePath}: Value ${currentValue} at ${objectsArray[i].timestamp} significantly deviates from the next value.`
        );
      }
    }

    if (shouldDelete) {
      for (let i = indexesToDelete.length - 1; i >= 0; i--) {
        objectsArray.splice(indexesToDelete[i], 1); // Remove the object
        lines.splice(indexesToDelete[i] + 1, 1); // +1 to account for header line
      }
      const newData = lines.join('\n');
      fs.writeFileSync(filePath, newData, 'utf8');
      console.log(`Deleted ${originalLineCount - lines.length} significant deviations from ${filePath}`);
    }
  } catch (err) {
    console.error('Error processing the file:', err);
  }
}

function debugPriceDataInDirectory(directoryPath, shouldDelete, filterString) {
  try {
    const files = fs.readdirSync(directoryPath).filter((file) => file.includes(filterString));
    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      processFile(filePath, shouldDelete); // Process each file synchronously
    }
  } catch (err) {
    console.error('Error reading the directory:', err);
  }
}

// Invoke the ritual with the option to cleanse data of significant deviations
// and focus on files containing a specified string
debugPriceDataInDirectory(directoryPath, shouldDeleteLines, fileFilterString);
