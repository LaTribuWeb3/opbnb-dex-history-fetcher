const { getLiquidity, getLiquidityAll } = require('../src/data.interface/data.interface');
const { watchedPairs } = require('../src/global.config');
const { PLATFORMS, BLOCK_PER_DAY } = require('../src/utils/constants');
const fs = require('fs');
const { roundTo } = require('../src/utils/utils');

async function checkLiquidity() {

  const platform = 'pancakeswapv2';
  const base = 'ETH';
  const quote = 'wBETH';

  const liquidity = getLiquidity(platform, base, quote, 36469367- BLOCK_PER_DAY, 36469367 );
   
    
}
checkLiquidity();
