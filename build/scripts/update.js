#!/usr/bin/env node

const { spawnSync } = require('child_process');
const { resolve } = require('path');
const setupEnv = require('./src/setupEnv');
const dockerLogin = require('./src/dockerLogin');
const setDockerMachineEnv = require('./src/setDockerMachineEnv');
const argv = require('yargs').argv;

const STACK_NAME = 'wwguide';

async function update() {
  // ---------- parse cli arguments
  const environment = argv.env;
  if (!environment) {
    console.error('Environment (local/staging/production) is required. Specify via --env');
    return;
  }
  let images = [];
  if (argv.image) {
    images = Array.isArray(argv.image) ? argv.image : [argv.image];
  }
  if (images.length === 0) {
    console.error('Specify list of images to update via --image');
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

  for (const image of images) {
    const packagePath = resolve('packages', image, 'package.json');
    const version = require(packagePath).version;
    spawnSync(
      'docker',
      [
        'service',
        'update',
        '--with-registry-auth',
        '--image',
        `${process.env.DOCKER_REGISTRY_PREFIX}${image}:${environment}.${version}`,
        `${STACK_NAME}_${image}`,
      ],
      {
        stdio: 'inherit',
      },
    );
  }
}

update();
