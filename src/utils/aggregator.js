/**
 * Compute the aggregated volume from two segments
 * Example to compute the volume for slippage of UNI/USDC using the two "segments"
 * UNI/WETH and WETH/USDC
 * Example for a target of 5% slippage:
 *  Start by trying to get the volume for 0.5% slippage of UNI/WETH and check if the amount of WETH
 *  obtainable is <= the volume for WETH/USDC for 4.5% slippage. If it is save the UNI base amount for 0.5% slippage
 *  else take the value dumpable from the segment2 and transform to UNI (using segment1 price)
 *  only if it's the maximum value we ever got. Then try for 1% slippage UNI/WETH and check against 4% slippage WETH/USDC
 *  This function then returns the maximum of UNI that is available using the route UNI/WETH -> WETH/USDC and a total of 5% slippage
 * @param {{[slippageBps: number]: {base: number, quote: number}}} segment1Data for example, this is the liquidity data for UNI/WETH
 * @param {number} segment1Price
 * @param {{[slippageBps: number]: {base: number, quote: number}}} segment2Data for example, this is the liquidity data for WETH/USDC
 * @param {number} targetSlippageBps
 * @returns {{base: number, quote: number}} for example base is UNI and quote is USDC
 */
function computeAggregatedVolumeFromPivot(segment1Data, segment2Data, targetSlippageBps) {
  let maxBaseAmount = 0;
  let quoteAmount = 0;

  for (let bps = 50; bps < targetSlippageBps; bps += 50) {
    // for segment1, base is UNI, quote is WETH
    const segment1LiquidityForSlippage = segment1Data[bps];
    const segment1AvgPriceForSelectedSlippage = segment1LiquidityForSlippage.quote / segment1LiquidityForSlippage.base;

    // for segment2 base is WETH, quote is USDC
    const segment2LiquidityForSlippage = segment2Data[targetSlippageBps - bps];
    const segment2AvgPriceForSelectedSlippage = segment2LiquidityForSlippage.quote / segment2LiquidityForSlippage.base;

    const amountOfBaseFromSegment2 = segment2LiquidityForSlippage.base / segment1AvgPriceForSelectedSlippage;
    const amountOfQuoteFromSegment1 = segment1LiquidityForSlippage.quote * segment2AvgPriceForSelectedSlippage;

    // check that you can dump liquidity from segment1 into the liquidity for segment2
    if (segment1LiquidityForSlippage.quote <= segment2LiquidityForSlippage.base) {
      // check if the maxBaseAmount is not higher, if not, consider this route the best route
      if (maxBaseAmount < segment1LiquidityForSlippage.base) {
        maxBaseAmount = segment1LiquidityForSlippage.base;
        quoteAmount = amountOfQuoteFromSegment1;
      }
    }
    // if you cannot dump liquidity from seg1 to seg2, take the amount from segment2 base
    // example for UNI/WETH with base = 200 and WETH/USDC = 150 then you cannot dump 200 from segment1 to segment2
    // so you take the UNI/WETH price, ex 0.0025053362839454513 and you take the base amount from segment2 (1500) and divide by price
    // 150 / 0.0025053362839454513 = 59872 UNI if 59872 UNI is more than the current base amount in memory, overwrite it
    else {
      if (maxBaseAmount < amountOfBaseFromSegment2) {
        maxBaseAmount = amountOfBaseFromSegment2;
        quoteAmount = segment2LiquidityForSlippage.quote;
      }
    }
  }

  return { base: maxBaseAmount, quote: quoteAmount };
}
/**
 *
 * @param {{[slippageBps: number]: {base: number, quote: number}}} segment1SlippageMap for example, this is the liquidity data for wBETH->ETH
 * @param {{[slippageBps: number]: {base: number, quote: number}}} segment2SlippageMap for example, this is the liquidity data for ETH->USDT
 * @param {{[slippageBps: number]: {base: number, quote: number}}} segment3SlippageMap for example, this is the liquidity data for USDT->TUSD
 * @returns {{base: number, quote: number}} for example base is wBETH and quote is TUSD
 */
function computeAggregatedVolumeFromPivot3(segment1SlippageMap, segment2SlippageMap, segment3SlippageMap) {
  let maxBase = 0;
  let quote = 0;
  let selectedOptions = [];

  const allOptions = generateAllOptions(50, 800, 3);
  for (const options of allOptions) {
    // console.log(options);
    const segment1Data = segment1SlippageMap[options[0]];
    const segment2Data = segment2SlippageMap[options[1]];
    const segment3Data = segment3SlippageMap[options[2]];

    const data = computeAggregate3(segment1Data, segment2Data, segment3Data);

    if (data.base > maxBase) {
      selectedOptions = options;
      maxBase = data.base;
      quote = data.quote;
    }
  }

  console.log(`Best options: ${selectedOptions}`);
  return { base: maxBase, quote };
}

/**
 * Compute the aggregated volume from 3 segments
 * Example wBETH->ETH + ETH->USDT + USDT->TUSD
 * @param {{base: number, quote: number}} segment1Data
 * @param {{base: number, quote: number}} segment2Data
 * @param {{base: number, quote: number}} segment3Data
 * @returns {{base: number, quote: number}}
 */
function computeAggregate3(segment1Data, segment2Data, segment3Data) {
  // console.log({segment1Data});
  // console.log({segment2Data});
  // console.log({segment3Data});
  const rate1 = segment1Data.quote / segment1Data.base;
  const rate2 = segment2Data.quote / segment2Data.base;
  const rate3 = segment3Data.quote / segment3Data.base;
  let baseUtilization = 1; // 100% base1
  if (segment1Data.quote > segment2Data.base) {
    // if we cannot dump all quote obtained from segment1 to the base of segment2, compute
    // the % of base utilization. Example if wBETH->ETH is 30 wBETH => 45 ETH
    // but the ETH->USDT segment is 5 ETH -> 15k USDT, we will compute 5/45 = 11% utilization
    baseUtilization = segment2Data.base / segment1Data.quote;
  }

  const base1ReallySold = segment1Data.base * baseUtilization;
  const quote1Obtained = base1ReallySold * rate1;
  const quote2Obtained = quote1Obtained * rate2; // this is USDT
  let segment2Utilization = 1;
  if (quote2Obtained > segment3Data.base) {
    // if we cannot dump all quote obtained from segment2 to the base of segment3, compute
    // the % of base utilization. Example if ETH->USDT is 5 ETH => 15k USDT
    // but the USDT->TUSD segment is 3k USDT -> 3k TUSD, we will compute 3k/15k and apply it to the already computed baseUtilization
    segment2Utilization = segment3Data.base / quote2Obtained;
    baseUtilization = baseUtilization * segment2Utilization;
  }

  const base2ReallySold = segment2Data.base * segment2Utilization;
  const quote2ReallyObtained = base2ReallySold * rate2;
  const quote3Obtained = quote2ReallyObtained * rate3; // this is TUSD
  const baseUsed = segment1Data.base * baseUtilization;

  return { base: baseUsed, quote: quote3Obtained };
}

const wBETHETHSlippageMap = {
  50: {
    base: 388.4476791825441,
    quote: 399.1754663153312
  },
  100: {
    base: 746.1437193979058,
    quote: 764.8276177588104
  },
  150: {
    base: 1033.836706737315,
    quote: 1057.5973186331057
  },
  200: {
    base: 1037.8672022860346,
    quote: 1061.676442289478
  },
  250: {
    base: 1041.943883280888,
    quote: 1065.781713839842
  },
  300: {
    base: 1045.942024048689,
    quote: 1069.7878579643993
  },
  350: {
    base: 1049.1480174692922,
    quote: 1072.9858475591166
  },
  400: {
    base: 1050.759110672715,
    quote: 1074.5880894523825
  },
  450: {
    base: 1050.769240284082,
    quote: 1074.5980982408407
  },
  500: {
    base: 1050.7793952498891,
    quote: 1074.6080820398274
  },
  550: {
    base: 1050.7895756335993,
    quote: 1074.618040911735
  },
  600: {
    base: 1050.7977382842055,
    quote: 1074.6259901035921
  },
  650: {
    base: 1050.8079645805724,
    quote: 1074.6359042634888
  },
  700: {
    base: 1050.8182164733828,
    quote: 1074.645793670178
  },
  750: {
    base: 1050.8264364601187,
    quote: 1074.6536874147564
  },
  800: {
    base: 1050.830707962775,
    quote: 1074.6577767280112
  }
};

const ETHUSDTSlippageMap = {
  50: {
    base: 8.51213664031093,
    quote: 25018.604153192828
  },
  100: {
    base: 15.874837865301465,
    quote: 46542.79044781314
  },
  150: {
    base: 23.25592588791115,
    quote: 68013.11362528069
  },
  200: {
    base: 30.283036606341067,
    quote: 88352.4214099337
  },
  250: {
    base: 37.37546864270023,
    quote: 108776.9861693071
  },
  300: {
    base: 44.58839383431093,
    quote: 129446.53792562203
  },
  350: {
    base: 51.26316936930275,
    quote: 148477.69119425313
  },
  400: {
    base: 59.2569371677605,
    quote: 171145.12119363045
  },
  450: {
    base: 65.92766263490452,
    quote: 189956.95401502668
  },
  500: {
    base: 71.69875171843,
    quote: 206151.47139469726
  },
  550: {
    base: 76.51846143739012,
    quote: 219609.99070907044
  },
  600: {
    base: 80.35330073644788,
    quote: 230257.5707760472
  },
  650: {
    base: 83.57130550818812,
    quote: 239143.37406461872
  },
  700: {
    base: 86.7958886790319,
    quote: 248003.00759457285
  },
  750: {
    base: 90.67107596011617,
    quote: 258592.25223135672
  },
  800: {
    base: 93.9285955686875,
    quote: 267444.83108813176
  }
};


function generateAllOptions(jumpSize, theSum, numVars) {
  if (numVars === 1) {
    return [[theSum]];
  }
  // else
  let result = [];
  let maxValue = theSum - (numVars - 1) * jumpSize;
  for (let i = 0; i < Math.floor(maxValue / jumpSize); i++) {
    let value = (i + 1) * jumpSize;
    let options = generateAllOptions(jumpSize, theSum - value, numVars - 1);
    let currList = [value];
    for (let anOption of options) {
      result.push(currList.concat(anOption));
    }
  }
  return result;
}

module.exports = { computeAggregatedVolumeFromPivot };
