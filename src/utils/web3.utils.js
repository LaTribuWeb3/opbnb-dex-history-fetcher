const axios = require('axios');
const dotenv = require('dotenv');
const { retry, fnName, sleep } = require('./utils');
dotenv.config();

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || 'YourApiKeyToken';

let lastCallEtherscan = 0;

async function getTxHashFromEtherscan(contractAddress) {
  const etherscanUrl = `https://api.bscscan.com/api?module=contract&action=getcontractcreation&contractaddresses=${contractAddress}&apikey=${ETHERSCAN_API_KEY}`;
  const etherscanResponse = await axios.get(etherscanUrl);

  if (etherscanResponse.data.message == 'NOTOK') {
    throw new Error(`getTxHashFromEtherscan: Error: ${etherscanResponse.data.result}`);
  } else if (etherscanResponse.data.result[0].txHash) {
    return etherscanResponse.data.result[0].txHash;
  } else {
    console.error(etherscanResponse);
    throw new Error('`getTxHashFromEtherscan: unknown error');
  }
}

/**
 * Get the contract creation blocknumber using etherscan api
 * WILL ONLY WORK ON MAINNET
 * @param {ethers.providers.BaseProvider} web3Provider
 * @param {string} contractAddress
 * @returns {Promise<number>} blocknumber where the contract was created
 */
async function GetContractCreationBlockNumber(web3Provider, contractAddress) {
  console.log(`${fnName()}: fetching data for contract ${contractAddress}`);
  const msToWait = 10000 - (Date.now() - lastCallEtherscan);
  if (msToWait > 0) {
    console.log(`${fnName()}: Sleeping ${msToWait} before calling etherscan`);
    await sleep(msToWait);
  }
  // call etherscan to get the tx receipt of contract creation
  const txHash = await retry(getTxHashFromEtherscan, [contractAddress]);
  lastCallEtherscan = Date.now();

  const receipt = await retry(getTxHash, [web3Provider, txHash]);
  // console.log(receipt);
  console.log(`${fnName()}: returning blocknumber: ${receipt.blockNumber}`);
  return receipt.blockNumber;
}

async function getTxHash(web3Provider, txHash) {
  const receipt = await web3Provider.getTransactionReceipt(txHash);
  if (!receipt) {
    throw new Error('Cannot get receipt');
  }

  return receipt;
}

/**
 * Get block closest of timestamp, using defillama api
 * Retry 10 times if needed
 * @param {number} timestamp in seconds
 * @returns {Promise<number>} blocknumber
 */
async function getBlocknumberForTimestamp(timestamp) {
  const defiLamaResp = await retry(axios.get, [`https://coins.llama.fi/block/bsc/${timestamp}`]);
  const blockNumber = defiLamaResp.data.height;
  console.log(`${fnName()}: at timestamp ${timestamp}, block: ${blockNumber}`);
  return blockNumber;
}

module.exports = { GetContractCreationBlockNumber, getBlocknumberForTimestamp };
