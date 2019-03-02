import { spawnSync } from 'child_process';
import { resolve } from 'path';
import { argv } from 'yargs';
import { STACK_NAME } from './constants';
import { isEnvType, isMachine } from './types';
import {
  dockerLogin,
  gitGuardian,
  prerelaseGuardian,
  setDockerMachineEnv,
  setupEnv,
} from './utils';

async function update() {
  // ---------- parse cli arguments
  const environment = argv.env as any;
  if (!isEnvType(environment)) {
    throw new Error(
      'Environment (local/staging/production) is required. Specify via --env',
    );
  }
  let services = [];
  if (argv.service) {
    services = Array.isArray(argv.service) ? argv.service : [argv.service];
  }
  if (services.length === 0) {
    throw new Error('Specify list of services to update via --service');
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
  // Login as docker-image reader
  dockerLogin(true);
  // load docker-machine env
  setDockerMachineEnv(machineName);

  for (const service of services) {
    const packagePath = resolve('services', service, 'package.json');
    const version = require(packagePath).version;
    const image = `${process.env.DOCKER_REGISTRY_PREFIX}${service}:${version}`;
    spawnSync(
      'docker',
      [
        'service',
        'update',
        '--with-registry-auth',
        '--image',
        image,
        '--update-failure-action',
        'rollback',
        `${STACK_NAME}_${service}`,
      ],
      {
        stdio: 'inherit',
      },
    );
  }
}

update();
