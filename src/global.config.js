const tokens = {
  BNB: {
    decimals: 18,
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    dustAmount: 0.001
  },
  WBNB: {
    decimals: 18,
    address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    dustAmount: 0.001
  },
  BTCB: {
    decimals: 18,
    address: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
    dustAmount: 0.000001
  },
  DAI: {
    decimals: 18,
    address: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
    dustAmount: 0.01
  },
  USDC: {
    decimals: 18,
    address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    dustAmount: 0.01
  },
  ETH: {
    decimals: 18,
    address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
    dustAmount: 0.00001
  },
  USDT: {
    decimals: 18,
    address: '0x55d398326f99059fF775485246999027B3197955',
    dustAmount: 0.01
  },
  FDUSD: {
    decimals: 18,
    address: '0xc5f0f7b66764F6ec8C8Dff7BA683102295E16409',
    dustAmount: 0.01
  },
  wBETH: {
    decimals: 18,
    address: '0xa2E3356610840701BDf5611a53974510Ae27E2e1',
    dustAmount: 0.01
  },
  lisUSD: {
    decimals: 18,
    address: '0x0782b6d8c4551B9760e74c0545a9bCD90bdc41E5',
    dustAmount: 0.01
  },
  SnBNB: {
    decimals: 18,
    address: '0xB0b84D294e0C75A6abe60171b70edEb2EFd14A1B',
    dustAmount: 0.001
  },
  slisBNB: {
    decimals: 18,
    address: '0xB0b84D294e0C75A6abe60171b70edEb2EFd14A1B',
    dustAmount: 0.001
  },
  ezETH : {
    decimals: 18,
    address: '0x2416092f143378750bb29b79eD961ab195CcEea5',
    dustAmount: 0.00001
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
    {
      quote: 'wBETH',
      pivots: ['ETH'],
      exportToInternalDashboard: true
    },
    {
      quote: 'lisUSD',
      pivots: undefined,
      exportToInternalDashboard: true
    },
    {
      quote: 'SnBNB',
      pivots: undefined,
      exportToInternalDashboard: true
    },
    {
      quote: 'slisBNB',
      pivots: undefined,
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
    {
      quote: 'wBETH',
      pivots: ['ETH'],
      exportToInternalDashboard: true
    },
    {
      quote: 'lisUSD',
      pivots: ['WBNB'],
      exportToInternalDashboard: true
    },
    {
      quote: 'SnBNB',
      pivots: ['WBNB'],
      exportToInternalDashboard: true
    },
    {
      quote: 'slisBNB',
      pivots: ['WBNB'],
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
    {
      quote: 'wBETH',
      pivots: ['ETH'],
      exportToInternalDashboard: true
    },
    {
      quote: 'lisUSD',
      pivots: ['WBNB'],
      exportToInternalDashboard: true
    },
    {
      quote: 'SnBNB',
      pivots: ['WBNB'],
      exportToInternalDashboard: true
    },
    {
      quote: 'slisBNB',
      pivots: ['WBNB'],
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
    {
      quote: 'wBETH',
      pivots: undefined,
      exportToInternalDashboard: true
    },
    {
      quote: 'lisUSD',
      pivots: ['WBNB'],
      exportToInternalDashboard: true
    },
    {
      quote: 'SnBNB',
      pivots: ['WBNB'],
      exportToInternalDashboard: true
    },
    {
      quote: 'slisBNB',
      pivots: ['WBNB'],
      exportToInternalDashboard: true
    },
    {
      quote: 'ezETH',
      pivots: undefined,
      exportToInternalDashboard: true
    },
  ],
  USDT: [
    {
      quote: 'FDUSD',
      pivots: undefined,
      exportToInternalDashboard: true
    },
    {
      quote: 'wBETH',
      pivots: ['ETH'],
      exportToInternalDashboard: true
    },
    {
      quote: 'lisUSD',
      pivots: undefined,
      exportToInternalDashboard: true
    },
    {
      quote: 'SnBNB',
      pivots: ['WBNB'],
      exportToInternalDashboard: true
    },
    {
      quote: 'slisBNB',
      pivots: ['WBNB'],
      exportToInternalDashboard: true
    },
  ],
  FDUSD: [
    {
      quote: 'wBETH',
      pivots: ['USDT', 'ETH'],
      exportToInternalDashboard: true
    },
    {
      quote: 'lisUSD',
      pivots: ['USDT'],
      exportToInternalDashboard: true
    },
    {
      quote: 'SnBNB',
      pivots: ['USDT', 'WBNB'],
      exportToInternalDashboard: true
    },
    {
      quote: 'slisBNB',
      pivots: ['WBNB'],
      exportToInternalDashboard: true
    },
  ],
  wBETH: [
    {
      quote: 'lisUSD',
      pivots: ['ETH'],
      exportToInternalDashboard: true
    },
    {
      quote: 'SnBNB',
      pivots: ['ETH', 'WBNB'],
      exportToInternalDashboard: true
    },
    {
      quote: 'slisBNB',
      pivots: ['ETH', 'WBNB'],
      exportToInternalDashboard: true
    },
  ],
  lisUSD: [
    {
      quote: 'SnBNB',
      pivots: ['WBNB'],
      exportToInternalDashboard: true
    },
    {
      quote: 'slisBNB',
      pivots: ['WBNB'],
      exportToInternalDashboard: true
    },
  ],
};

const pairsToFetch = ['WBNB', 'USDT', 'ETH', 'BTCB', 'USDC', 'FDUSD', 'SnBNB', 'wBETH', 'lisUSD', 'slisBNB', 'ezETH'];

const newAssetsForMinVolatility = [ 'ezETH' ];

module.exports = { tokens, watchedPairs, pairsToFetch, newAssetsForMinVolatility };