const { spawnSync } = require('child_process');
const dotenv = require('dotenv');

const setDockerMachineEnv = (machineName) => {
  const dmEnv = spawnSync('docker-machine', ['env', machineName]);
  if (dmEnv.status !== 0) {
    console.log(`\n\nFailed to get docker-machine env for ${machineName}`);
    throw new Error(`Failed to get docker-machine env for ${machineName}`);
  }
  const dockerMachineEnv = dotenv.parse(dmEnv.stdout.toString().replace(/export\s/g, ''));
  Object.entries(dockerMachineEnv).forEach(([key, value]) => { process.env[key] = value; });
};

module.exports = setDockerMachineEnv;
