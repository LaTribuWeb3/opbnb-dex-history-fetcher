const BigNumber = require('bignumber.js');

/**
 * Where all the files are saved
 */
const DATA_DIR = process.cwd() + '/data';

/**
 * List of platforms (dexes) that are available for data querying
 */
const PLATFORMS = ['pancakeswapv3'];
// const PLATFORMS = ['pancake', 'pancakeswapv2', 'pancakeswapv3', 'wombat'];

/**
 * Base slippages we are searching for the risk oracle frontend
 * Value in percent
 */
const TARGET_SLIPPAGES = [1, 5, 10, 15, 20];

/**
 * The spans of days we want to export to the risk oracle frontend
 */
const SPANS = [1, 7, 30, 180, 365];

const BN_1e18 = new BigNumber(10).pow(18);

/**
 * data source -> uint map
 * from contract:
 * enum LiquiditySource {
        All,
        UniV2,
        UniV3,
        Curve
    }
 */
const smartLTVSourceMap = {
  all: 0,
  uniswapv2: 1,
  uniswapv3: 2,
  curve: 3
};

const MORPHO_RISK_PARAMETERS_ARRAY = [
  {
    ltv: 0.98,
    bonus: 50
  },
  {
    ltv: 0.965,
    bonus: 100
  },
  {
    ltv: 0.945,
    bonus: 150
  },

  {
    ltv: 0.915,
    bonus: 250
  },
  {
    ltv: 0.86,
    bonus: 400
  },
  {
    ltv: 0.77,
    bonus: 700
  },
  {
    ltv: 0.625,
    bonus: 1250
  }
];

const DEFAULT_STEP_BLOCK = 600;
const MEDIAN_OVER_BLOCK = 3600; // amount of blocks to median the price over

const BLOCK_PER_DAY = 86400;

const HALF_LIFE_1Y = Math.exp(Math.log(0.5) / 365); // 0.9962091367899786 used when computing the rolling avg biggest daily change
const HALF_LIFE_2Y = Math.exp(Math.log(0.5) / 730); // 0.9981027686515946 used when computing the rolling avg biggest daily change
const LAMBDA = HALF_LIFE_2Y;

module.exports = {
  DATA_DIR,
  PLATFORMS,
  TARGET_SLIPPAGES,
  SPANS,
  BN_1e18,
  smartLTVSourceMap,
  DEFAULT_STEP_BLOCK,
  BLOCK_PER_DAY,
  LAMBDA,
  MEDIAN_OVER_BLOCK,
  HALF_LIFE_1Y,
  HALF_LIFE_2Y,
  MORPHO_RISK_PARAMETERS_ARRAY
};
