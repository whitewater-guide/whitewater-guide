import { spawnSync } from 'child_process';
import dotenv from 'dotenv';
import { Machine } from '../types';

/**
 * Sets up process.env variables so that all further docker commands are executed on different machine
 * @param machine
 */
export const setDockerMachineEnv = (machine: Machine) => {
  const dmEnv = spawnSync('docker-machine', ['env', machine]);
  if (dmEnv.status !== 0) {
    throw new Error(`Failed to get docker-machine env for ${machine}`);
  }
  const dockerMachineEnv = dotenv.parse(
    dmEnv.stdout.toString().replace(/export\s/g, ''),
  );
  Object.entries(dockerMachineEnv).forEach(([key, value]) => {
    process.env[key] = value;
  });
};
