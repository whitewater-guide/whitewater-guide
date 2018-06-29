#!/usr/bin/env node

const { spawnSync } = require('child_process');
const { resolve } = require('path');
const { STACK_NAME } = require('./src/constants');
const setupEnv = require('./src/setupEnv');
const dockerLogin = require('./src/dockerLogin');
const setDockerMachineEnv = require('./src/setDockerMachineEnv');
const { argv } = require('yargs');

async function update() {
  // ---------- parse cli arguments
  const environment = argv.env;
  if (!environment) {
    console.error('Environment (local/staging/production) is required. Specify via --env');
    return;
  }
  let services = [];
  if (argv.service) {
    services = Array.isArray(argv.service) ? argv.service : [argv.service];
  }
  if (services.length === 0) {
    console.error('Specify list of services to update via --service');
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
  // Login as docker-image reader
  dockerLogin(true);
  // load docker-machine env
  setDockerMachineEnv(machineName);

  for (const service of services) {
    const packagePath = resolve('packages', service, 'package.json');
    const version = require(packagePath).version;
    spawnSync(
      'docker',
      [
        'service',
        'update',
        '--with-registry-auth',
        '--image',
        `${process.env.DOCKER_REGISTRY_PREFIX}${service}:${environment}.${version}`,
        `${STACK_NAME}_${service}`,
      ],
      {
        stdio: 'inherit',
      },
    );
  }
}

update();
