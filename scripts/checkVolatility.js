const { getPricesAtBlockForIntervalViaPivot, getPricesAtBlockForIntervalViaPivots } = require('../src/data.interface/internal/data.interface.utils');
const { medianPricesOverBlocks, computeBiggestDailyChange, rollingBiggestDailyChange } = require('../src/utils/volatility');
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');
const { DATA_DIR, HALF_LIFE_1Y, HALF_LIFE_2Y } = require('../src/utils/constants');
const { getRollingVolatility } = require('../src/data.interface/data.interface');
const { watchedPairs } = require('../src/global.config');
const { promisify } = require('util');

async function checkVolatility() {

  const base = 'USDC';
  const quote = 'USDT';
  // const prices = getPricesAtBlockForIntervalViaPivots('pancakeswapv3', base, quote, 0, 19_000_000);
  // const medianed = medianPricesOverBlocks(prices, undefined);

  const web3Provider = new ethers.providers.StaticJsonRpcProvider('https://nameless-tame-panorama.bsc.quiknode.pro/b87b894fe24ed3fbe12b2b14e1fd6931677cab09/');
  // let volatility_all = await rollingBiggestDailyChange(medianed, web3Provider);
  // console.log(volatility_all.latest.current);
  const volatility_all = await getRollingVolatility('all', base, quote, web3Provider);
  console.log(volatility_all.latest.current);

  // fs.writeFileSync('volatility.json', JSON.stringify(volatility_all, null, 2));

  // const volatility_all = await getRollingVolatility('all', base, quote, web3Provider);
  // fs.writeFileSync('volatility.json', JSON.stringify(volatility_all, null, 2));

  // const volatility_1y = await getRollingVolatility('uniswapv3', 'wstETH', 'WETH', web3Provider);
  // fs.writeFileSync('volatility.json', JSON.stringify(volatility_1y, null, 2));
  // fs.writeFileSync('volatility.csv', 'blockstart,blockend,yesterday,current,minprice,maxprice\n');

  // for(const vol of volatility_1y.history) {
  //     fs.appendFileSync('volatility.csv', `${vol.blockStart},${vol.blockEnd},${vol.yesterday},${vol.current},${vol.minPrice},${vol.maxPrice}\n`);
  // }

  // const volatility_2y = await getRollingVolatility('uniswapv3', 'wstETH', 'WETH', web3Provider, HALF_LIFE_2Y);
  // fs.writeFileSync('volatility_2y.json', JSON.stringify(volatility_2y, null, 2));


  // fs.writeFileSync('volatility_2y.csv', 'blockstart,blockend,yesterday,current,minprice,maxprice\n');

  // for(const vol of volatility_2y.history) {
  //     fs.appendFileSync('volatility_2y.csv', `${vol.blockStart},${vol.blockEnd},${vol.yesterday},${vol.current},${vol.minPrice},${vol.maxPrice}\n`);
  // }

}


const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);
const existsAsync = promisify(fs.exists);


async function checkVolatilitiesAndLogMissingPairs(threshold) {
  const outputPath = path.join(DATA_DIR, 'volatilities.json');
  const missingPairsPath = path.join(DATA_DIR, 'missingPairs.json');
  const web3Provider = new ethers.providers.StaticJsonRpcProvider('https://nameless-tame-panorama.bsc.quiknode.pro/b87b894fe24ed3fbe12b2b14e1fd6931677cab09/');
  const results = [];
  const missingPairs = [];
  threshold = threshold / 100;
  
  for (const base of Object.keys(watchedPairs)) {
    for (const pair of watchedPairs[base]) {
      const quote = pair.quote;
      try {
        const volatility = await getRollingVolatility('all', base, quote, web3Provider);
        if (volatility.latest.current > threshold) {
          const result = { base, quote, volatility: volatility.latest.current };
          console.log(`Volatility for ${base}/${quote} is above threshold: ${volatility.latest.current}`);
          results.push(result);
        }
      } catch (error) {
        console.error(`Error checking volatility for ${base}/${quote}:`, error);
        if (error.message.includes('does not exists') || error.message.includes('Cannot read properties of undefined')) {
          missingPairs.push({ base, quote, error: error.message });
        }
      }
    }
  }
  
  // Write results to the specified output file
  if (results.length > 0) {
    try {
      results.sort((a, b) => b.volatility - a.volatility);
      await writeFileAsync(outputPath, JSON.stringify(results, null, 2));
      console.log(`Volatility data written to ${outputPath}`);
    } catch (writeError) {
      console.error('Error writing volatility data to file:', writeError);
    }
  } else {
    console.log('No volatilities above threshold, no file written.');
  }
  
  await writeFileAsync(outputPath, JSON.stringify(results, null, 2)).catch((error) => {
    console.error('Error writing volatility data to file:', error);
  });
  console.log(`Volatility data written to ${outputPath}`);

  // If no missing pairs, delete the existing missing pairs file if it exists
  if (missingPairs.length === 0) {
    const fileExists = await existsAsync(missingPairsPath);
    if (fileExists) {
      await unlinkAsync(missingPairsPath).catch((error) => {
        console.error('Error deleting the missing pairs file:', error);
      });
      console.log(`${missingPairsPath} was deleted as there are no longer any missing pairs.`);
    }
  } else {
    // Write or update the missing pairs file if there are missing pairs
    await writeFileAsync(missingPairsPath, JSON.stringify(missingPairs, null, 2)).catch((error) => {
      console.error('Error writing missing pairs data to file:', error);
    });
    console.log(`Missing pairs data written to ${missingPairsPath}`);
  }
}



checkVolatilitiesAndLogMissingPairs(10).then(() => console.log('Volatility check complete.'));


// checkVolatility();