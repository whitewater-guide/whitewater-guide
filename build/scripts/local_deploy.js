#!/usr/bin/env node

// Run this from developer machine

const { spawnSync } = require('child_process');
const dotenv = require('dotenv');
const argv = require('yargs').argv;
const generateStackFile = require('./src/generateStackFile');
const setupEnv = require('./src/setupEnv');
const hasChanged = require('./src/hasChanged');

const CONFIG_NAME = 'local';
const STACK_NAME = 'wwguide';
const MACHINE_NAME = 'ww-local';

async function localDeploy() {
  const noCommit = argv.noCommit; // Ignore uncommitted git protection
  // Build fresh images for all (default) or some (specify via --container flags) services
  // Multiple flags allowed, e.g. --container caddy --container db
  let containers = [];
  if (argv.container) {
    containers = Array.isArray(argv.container) ? argv.container : [argv.container];
  }

  if (hasChanged() && !noCommit) {
    console.error('\n\nCommit all changes before updating docker stack');
    return;
  }

  // Set DOCKER_ENV_FILE and CONTAINERX_TAG env vars for this process
  setupEnv(CONFIG_NAME);
  // Merge docker-compose.yml and docker-compose.local.yml
  const stackFile = await generateStackFile(CONFIG_NAME);

  // Ensure that backend is compiled
  if (containers.length === 0 || containers.includes('backend')) {
    const tscResult = spawnSync('yarn', ['run', 'tsc'], { cwd: 'packages/backend', stdio: 'inherit' });
    if (tscResult.status !== 0) {
      console.log('\n\nFailed to compile backend, please fix');
      return;
    }
  }

  // Ensure that web is compiled
  if (containers.length === 0 || containers.includes('web')) {
    const tscResult = spawnSync('yarn', ['run', 'build'], { cwd: 'packages/web', stdio: 'inherit' });
    if (tscResult.status !== 0) {
      console.log('\n\nFailed to compile web, please fix');
      return;
    }
  }

  // load docker-machine env
  const dmEnv = spawnSync('docker-machine', ['env', MACHINE_NAME]);
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
    ['image', 'prune', '-a', '-f', '--filter', '"until=72h"'],
    { stdio: 'inherit' },
  );

  const buildRes = spawnSync(
    'docker-compose',
    ['-f', stackFile, 'build', ...containers],
    { stdio: 'inherit' },
  );
  if (buildRes.status !== 0) {
    console.log('\n\nFailed to build docker images');
    return;
  }

  spawnSync(
    'docker',
    ['stack', 'deploy', '-c', stackFile, STACK_NAME],
    { stdio: 'inherit' },
  );
}

localDeploy();
