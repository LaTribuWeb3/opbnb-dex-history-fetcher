function test(
    volatility,
    liquidity,
    liquidationBonus,
    ltv,
    borrowCap
) {
    const sigma = volatility;
    const d = borrowCap;
    const beta = liquidationBonus;
    const l = liquidity;
      
    const sigmaTimesSqrtOfD = sigma * Math.sqrt(d);
    const ltvPlusBeta = ltv + beta;
    const lnOneDividedByLtvPlusBeta = Math.log(1 / ltvPlusBeta);
    const lnOneDividedByLtvPlusBetaTimesSqrtOfL = lnOneDividedByLtvPlusBeta * Math.sqrt(l);
    const r = sigmaTimesSqrtOfD / lnOneDividedByLtvPlusBetaTimesSqrtOfL;
    console.log(r);
    return r;

      
}

test(6.31/100, 55.6483, 8/100, 96.5/100, 701);