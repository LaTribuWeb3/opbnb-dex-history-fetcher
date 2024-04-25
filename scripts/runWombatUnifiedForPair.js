const { createUnifiedFileForPairWombat } = require('../src/wombat/wombat.unified.generator');

async function runWombatUnifiedForPair() {
  console.log(process.argv);
  await createUnifiedFileForPairWombat(process.argv[2], process.argv[3], process.argv[4], process.argv[5]);
  // createUnifiedFileForPair(18291464, 'USDT', 'WETH', 'tricryptoUSDTPool');
}

runWombatUnifiedForPair();