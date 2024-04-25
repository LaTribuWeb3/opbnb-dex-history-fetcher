const axios = require('axios');
const dotenv = require('dotenv');
const { retry, fnName, sleep } = require('./utils');
dotenv.config();

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || 'YourApiKeyToken';

let lastCallEtherscan = 0;

async function getTxHashFromEtherscan(contractAddress) {
  const url = 'https://opbnb-mainnet.nodereal.io/v1/9d89a35466ac44888e9364ed79c38176';
  const data = {
    jsonrpc: '2.0',
    method: 'nr_getContractCreationTransaction',
    params: [contractAddress],
    id: 1
  };
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const response = await axios.post(url, data, config);

  if (response.statusText == 'NOTOK') {
    throw new Error(`getTxHashFromEtherscan: Error: ${response.data.result}`);
  } else if (response.data.result.blockNumber) {
    return response.data.result.blockNumber;
  } else {
    console.error(response);
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
  const blockNumber = await retry(getTxHashFromEtherscan, [contractAddress]);
  lastCallEtherscan = Date.now();
  console.log(`${fnName()}: returning blocknumber: ${blockNumber}`);
  return blockNumber;
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
