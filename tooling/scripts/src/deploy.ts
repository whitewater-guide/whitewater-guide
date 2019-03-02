#!/usr/bin/env node

import { spawnSync } from 'child_process';
import { argv } from 'yargs';
import { STACK_NAME } from './constants';
import { isEnvType, isMachine } from './types';
import {
  dockerLogin,
  generateStackFile,
  gitGuardian,
  prerelaseGuardian,
  setDockerMachineEnv,
  setupEnv,
} from './utils';

async function deploy() {
  // ---------- parse cli arguments
  const environment = argv.env as any;
  if (!isEnvType(environment)) {
    throw new Error(
      'Environment (local/staging/production) is required. Specify via --env',
    );
  }
  const machineName = argv.machine as any;
  if (!isMachine(machineName)) {
    throw new Error(
      'Machine name (ww-local/ww-staging etc) is required. Specify via --machine',
    );
  }
  // ------------- cli arguments parsed

  await gitGuardian(environment);
  await prerelaseGuardian(environment);

  // Set environment variables for build-time substitution in compose files
  setupEnv(environment);
  // Merge docker-compose files
  const stackFile = await generateStackFile(environment);
  // Login as docker-image reader
  dockerLogin(true);
  // load docker-machine env
  setDockerMachineEnv(machineName);

  // -------- From now on commands are executed on docker-machine ------------

  // Prune old images
  spawnSync('docker', ['image', 'prune', '-a', '-f', '--filter', 'until=72h'], {
    stdio: 'inherit',
  });

  // deploy will succeed even when images are not published
  // pull images first to prevent deploy from running when some images are missing
  const pullResult = spawnSync(
    'docker-compose',
    ['-f', stackFile, 'pull', '-q'],
    { stdio: 'inherit' },
  );
  if (pullResult.status !== 0) {
    throw new Error('Some images in stack are missing');
  }

  // Deploy the stack
  spawnSync(
    'docker',
    ['stack', 'deploy', '--with-registry-auth', '-c', stackFile, STACK_NAME],
    { stdio: 'inherit' },
  );
}

deploy();
