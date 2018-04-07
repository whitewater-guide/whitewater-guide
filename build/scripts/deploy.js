#!/usr/bin/env node

const { spawnSync } = require('child_process');
const dotenv = require('dotenv');
const generateStackFile = require('./src/generateStackFile');
const setupEnv = require('./src/setupEnv');
const dockerLogin = require('./src/dockerLogin');
const argv = require('yargs').argv;

const STACK_NAME = 'wwguide';

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
  const dmEnv = spawnSync('docker-machine', ['env', machineName]);
  if (dmEnv.status !== 0) {
    console.log('\n\nFailed to get docker-machine env for ww-local');
    return;
  }
  const dockerMachineEnv = dotenv.parse(dmEnv.stdout.toString().replace(/export\s/g, ''));
  Object.entries(dockerMachineEnv).forEach(([key, value]) => { process.env[key] = value; });

  // -------- From now on commands are executed on docker-machine ------------

  // Prune old images
  spawnSync(
    'docker',
    ['image', 'prune', '-a', '-f', '--filter', 'until=72h'],
    { stdio: 'inherit' },
  );

  spawnSync(
    'docker',
    ['stack', 'deploy', '--with-registry-auth', '-c', stackFile, STACK_NAME],
    { stdio: 'inherit' },
  );
}

deploy();
