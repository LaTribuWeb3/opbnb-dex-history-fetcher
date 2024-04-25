const tokens = {
  WBNB: {
    decimals: 18,
    address: '0x4200000000000000000000000000000000000006',
    dustAmount: 0.001
  },
  BTCB: {
    decimals: 18,
    address: '0x7c6b91d9be155a6db01f749217d76ff02a7227f2',
    dustAmount: 0.000001
  },
  DAI: {
    decimals: 18,
    address: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
    dustAmount: 0.01
  },
  ETH: {
    decimals: 18,
    address: '0xe7798f023fc62146e8aa1b36da45fb70855a77ea',
    dustAmount: 0.00001
  },
  USDT: {
    decimals: 18,
    address: '0x9e5aac1ba1a2e6aed6b32689dfcf62a509ca96f3',
    dustAmount: 0.01
  },
  FDUSD: {
    decimals: 18,
    address: '0x50c5725949a6f0c72e6c4a641f24049a917db0cb',
    dustAmount: 0.01
  },
};
// goes both ways
const watchedPairs = {
  WBNB: [
    {
      quote: 'BTCB',
      pivots: undefined,
      exportToInternalDashboard: true
    },
    {
      quote: 'USDC',
      pivots: undefined,
      exportToInternalDashboard: true
    },
    {
      quote: 'ETH',
      pivots: undefined,
      exportToInternalDashboard: true
    },
    {
      quote: 'USDT',
      pivots: undefined,
      exportToInternalDashboard: true
    },
    {
      quote: 'FDUSD',
      pivots: ['USDT'],
      exportToInternalDashboard: true
    },
  ],
  BTCB: [
    {
      quote: 'USDC',
      pivots: ['USDT'],
      exportToInternalDashboard: true
    },
    {
      quote: 'ETH',
      pivots: undefined,
      exportToInternalDashboard: true
    },
    {
      quote: 'USDT',
      pivots: undefined,
      exportToInternalDashboard: true
    },
    {
      quote: 'FDUSD',
      pivots: ['USDT'],
      exportToInternalDashboard: true
    },
  ],
  USDC: [
    {
      quote: 'ETH',
      pivots: undefined,
      exportToInternalDashboard: true
    },
    {
      quote: 'USDT',
      pivots: undefined,
      exportToInternalDashboard: true
    },
    {
      quote: 'FDUSD',
      pivots: ['USDT'],
      exportToInternalDashboard: true
    },
  ],
  ETH: [
    {
      quote: 'USDT',
      pivots: undefined,
      exportToInternalDashboard: true
    },
    {
      quote: 'FDUSD',
      pivots: ['USDT'],
      exportToInternalDashboard: true
    },
  ],
  USDT: [
    {
      quote: 'FDUSD',
      pivots: undefined,
      exportToInternalDashboard: true
    },
  ],
};

const pairsToFetch = ['WBNB', 'USDT'];
// const pairsToFetch = ['WBNB', 'USDT', 'ETH', 'BTCB', 'USDC', 'FDUSD', 'SnBNB', 'wBETH', 'lisUSD', 'slisBNB', 'ezETH'];

const newAssetsForMinVolatility = [ 'ezETH' ];

module.exports = { tokens, watchedPairs, pairsToFetch, newAssetsForMinVolatility };