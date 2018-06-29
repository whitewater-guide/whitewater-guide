#!/usr/bin/env node

const { spawnSync } = require('child_process');
const generateStackFile = require('./src/generateStackFile');
const setupEnv = require('./src/setupEnv');
const dockerLogin = require('./src/dockerLogin');
const setDockerMachineEnv = require('./src/setDockerMachineEnv');
const { STACK_NAME } = require('./src/constants');
const { argv } = require('yargs');

async function deploy() {
  // ---------- parse cli arguments
  const environment = argv.env;
  if (!environment) {
    console.error('Environment (local/dtaging/production) is required. Specify via --env');
    return;
  }
  const machineName = argv.machine;
  if (!machineName) {
    console.error('Machine name (ww-local/ww-staging etc) is required. Specify via --machine');
    return;
  }
  // ------------- cli arguments parsed

  // Set environment variables for build-time substitution in compose files
  setupEnv(environment);
  // Merge docker-compose.yml and docker-compose.local.yml
  const stackFile = await generateStackFile(environment);
  // Login as docker-image reader
  dockerLogin(true);
  // load docker-machine env
  setDockerMachineEnv(machineName);

  // -------- From now on commands are executed on docker-machine ------------

  // Prune old images
  spawnSync(
    'docker',
    ['image', 'prune', '-a', '-f', '--filter', 'until=72h'],
    { stdio: 'inherit' },
  );

  // Deploy the stack
  spawnSync(
    'docker',
    ['stack', 'deploy', '--with-registry-auth', '-c', stackFile, STACK_NAME],
    { stdio: 'inherit' },
  );
}

deploy();
