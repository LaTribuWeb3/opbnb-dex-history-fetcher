const { exec } = require('child_process');
const { getAvailableCurve } = require('../src/curve/curve.utils');
const { sleep } = require('../src/utils/utils');
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');
const { DATA_DIR } = require('../src/utils/constants');
const { getAvailableWombat } = require('../src/wombat/wombat.utils');

async function runCurveUnifiedMultiThread() {
  const available = getAvailableWombat('./data');

  if(!fs.existsSync(path.join(DATA_DIR, 'precomputed', 'wombat'))) {
    fs.mkdirSync(path.join(DATA_DIR, 'precomputed', 'wombat'), {recursive: true});
  }
  // get most recent block by rpc
  const allChilds = [];

  for (const poolName of Object.keys(available)) {
    for (const base of Object.keys(available[poolName])) {
      for (const quote of available[poolName][base]) {
        const cmd = `node ./scripts/runWombatUnifiedForPair.js 0 ${base} ${quote} ${poolName}`;
        const childProcess = exec(cmd);
        allChilds.push(childProcess);
        await sleep(500);
      }
    }
  }

  await sleep(5000);
  let mustWait = allChilds.filter(_ => _.exitCode == null).length > 0;
  while(mustWait) {
    await sleep(10000);
    const subProcessStillRunningCount = allChilds.filter(_ => _.exitCode == null).length;
    console.log(`runWombatUnifiedMultiThread: Waiting for all subProcess to end. ${subProcessStillRunningCount}/${allChilds.length} still running`);
    mustWait = subProcessStillRunningCount > 0;
  }
}

runCurveUnifiedMultiThread();
module.exports = { runCurveUnifiedMultiThread };