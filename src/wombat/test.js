// index.js
const { BigNumber } = require('bignumber.js');
const dotenv = require('dotenv');
const CoreV2 = require('./wombat.core.v2');
const { ethers, Contract } = require('ethers');
const { providers } = require('@0xsequence/multicall');
const { wombatPools } = require('./wombat.config');
const { wombatAbis } = require('../utils/abis');
const { getTokenSymbolByAddress, normalize } = require('../utils/token.utils');
dotenv.config();

const RPC_URL = process.env.WOMBAT_RPC_URL;

async function test() {
  /*
    blocknumber,ampFactor,haircutRate,startCovRatio,endCovRatio,cash_DAI,liability_DAI,cash_USDC,liability_USDC,cash_USDT,liability_USDT

  */
  const web3Provider = new ethers.providers.StaticJsonRpcProvider(RPC_URL);
  const pool = wombatPools[0];
  const poolContract = new Contract(pool.poolAddress, pool.poolAbi, web3Provider);

  const baseValue = new BigNumber(1000).times(new BigNumber(10).pow(18)).toString(10);
  const val = await poolContract.quotePotentialSwap(
    '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
    '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    baseValue
  );

  console.log(`base: ${normalize(baseValue, 18)}, quote: ${normalize(val.potentialOutcome, 18)}`);
  console.log(`fee: ${normalize(val.haircut, 18)}`);
}

test();

async function TestFunction(amountIn) {
  //instantiate RPC
  const web3Provider = new ethers.providers.StaticJsonRpcProvider(RPC_URL);
  const multicallProvider = new providers.MulticallProvider(web3Provider);
  const pool = wombatPools[0];
  const poolContract = new Contract(pool.poolAddress, pool.poolAbi, multicallProvider);

  //get poolTokens
  const poolTokens = await poolContract.getTokens();
  //get wombat AssetTokens
  const poolAssets = [];
  for (const token of poolTokens) {
    poolAssets.push(await poolContract.addressOfAsset(token));
  }

  const poolAssetsContracts = [];
  for (const tokenAddress of poolAssets) {
    poolAssetsContracts.push(new Contract(tokenAddress, wombatAbis.wombatPoolAssetAbi, multicallProvider));
  }
  const promises = [];
  promises.push(poolContract.ampFactor());
  promises.push(poolContract.haircutRate());
  promises.push(poolContract.startCovRatio());
  promises.push(poolContract.endCovRatio());
  for (const contract of poolAssetsContracts) {
    promises.push(contract.cash());
    promises.push(contract.liability());
  }

  const promisesResults = await Promise.all(promises);

  // Define parameters for the swap quote function
  let Ax = undefined; // token X with 18 decimals
  let Ay = undefined; // token Y with 18 decimals
  let Lx = undefined; // token X liability with 18 decimals
  let Ly = undefined; // token Y liability with 18 decimals
  let A = undefined; // Amplification factor with 18 decimals
  let haircutRate = undefined; // haircut rate with 18 decimals
  let startCovRatio = undefined; // start coverage ratio with 18 decimals
  let endCovRatio = undefined; // start coverage ratio with 18 decimals
  const Dx = new BigNumber(amountIn).times(new BigNumber(10).pow(18)).toString(10); // token X delta (amount inputted) with 18 decimals

  for (let i = 0; i < promisesResults.length; i++) {
    if (i === 0) {
      A = promisesResults[i].toString(10);
    }
    if (i === 1) {
      haircutRate = promisesResults[i].toString(10);
    }
    if (i === 2) {
      startCovRatio = promisesResults[i].toString(10);
    }
    if (i === 3) {
      endCovRatio = promisesResults[i].toString(10);
    }
    if (i === 4) {
      Ax = promisesResults[i].toString(10);
    }
    if (i === 5) {
      Lx = promisesResults[i].toString(10);
    }
    if (i === 6) {
      Ay = promisesResults[i].toString(10);
    }
    if (i === 7) {
      Ly = promisesResults[i].toString(10);
    }
  }
  console.log('--Pool Info--');
  console.log('pool', pool.poolName);
  console.log('pool address', pool.poolAddress);
  console.log('pool haircut rate', haircutRate);
  console.log('--Pool Assets--');
  console.log('X token:', getTokenSymbolByAddress(poolTokens[0]));
  console.log('X token Address:', poolTokens[0]);
  console.log('Y token:', getTokenSymbolByAddress(poolTokens[1]));
  console.log('Y token Address:', poolTokens[1]);
  console.log('---');

  // Call the onchain swap quote function
  const onchainSmartContractQuote = await poolContract.quotePotentialSwap(poolTokens[0], poolTokens[1], Dx);

  // Instantiate CoreV2
  const coreV2 = new CoreV2();
  console.log('---');
  console.log('--CoreV2--');
  console.log('parameters passed to swapQuoteFunc');
  console.log('Ax:', Ax);
  console.log('Ay:', Ay);
  console.log('Lx:', Lx);
  console.log('Ly:', Ly);
  console.log('Dx:', Dx);
  console.log('A:', A);
  console.log('---');
  // Call the swap quote function
  const quote = coreV2._HighCovRatioFeePoolV2QuoteFrom(Ax, Ay, Lx, Ly, Dx, A, haircutRate, startCovRatio, endCovRatio);

  // Output the result
  const decimals = new BigNumber(10).pow(18);
  console.log('---');
  console.log('---');
  console.log(
    `Onchain - ${amountIn} ${getTokenSymbolByAddress(poolTokens[0])} swapped for ${normalize(
      onchainSmartContractQuote.potentialOutcome,
      18
    )} ${getTokenSymbolByAddress(poolTokens[1])}, fees: ${normalize(onchainSmartContractQuote.haircut, 18)}`
  );
  console.log(
    `Local Core v2 - ${amountIn} ${getTokenSymbolByAddress(poolTokens[0])} swapped for ${quote.actualToAmount.div(
      decimals
    )} ${getTokenSymbolByAddress(poolTokens[1])}, fees: ${quote.haircut.div(decimals)}`
  );
}
// TestFunction(100000);
