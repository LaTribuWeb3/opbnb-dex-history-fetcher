const tokens = {
  WBNB: {
    decimals: 18,
    address: '0x4200000000000000000000000000000000000006',
    mainnetAddress: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    dustAmount: 0.001
  },
  USDT: {
    decimals: 18,
    address: '0x9e5aac1ba1a2e6aed6b32689dfcf62a509ca96f3',
    mainnetAddress: '0x55d398326f99059fF775485246999027B3197955',
    dustAmount: 0.01
  },
};
// goes both ways
const watchedPairs = {
  WBNB: [
    {
      quote: 'USDT',
      pivots: undefined,
      exportToInternalDashboard: true
    },
  ],
  USDT: [
    {
      quote: 'WBNB',
      pivots: undefined,
      exportToInternalDashboard: true
    },
  ],
};

const pairsToFetch = ['WBNB', 'USDT'];
// const pairsToFetch = ['WBNB', 'USDT', 'ETH', 'BTCB', 'USDC', 'FDUSD', 'SnBNB', 'wBETH', 'lisUSD', 'slisBNB', 'ezETH'];

const newAssetsForMinVolatility = [ 'ezETH' ];

module.exports = { tokens, watchedPairs, pairsToFetch, newAssetsForMinVolatility };