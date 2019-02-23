import { spawnSync } from 'child_process';
import { argv } from 'yargs';
import { EnvType } from './types';
import {
  dockerLogin,
  generateStackFile,
  getChangedServices,
  gitGuardian,
  setupEnv,
} from './utils';

async function publish() {
  // Images are only published from dev branch
  await gitGuardian(EnvType.STAGING);

  // Set environment variables for build-time substitution in compose files
  setupEnv(EnvType.STAGING);
  // Merge docker-compose files
  const stackFile = await generateStackFile(EnvType.STAGING);

  let services: string[] = getChangedServices();
  // it's possible to explicitly list services to publish
  // via one or many --service arguments
  if (argv.service) {
    services = Array.isArray(argv.service)
      ? argv.service
      : argv.service === '*'
      ? []
      : [argv.service];
  }

  const buildRes = spawnSync(
    'docker-compose',
    ['-f', stackFile, 'build', ...services],
    { stdio: 'inherit' },
  );
  if (buildRes.status !== 0) {
    throw new Error('failed to build docker images');
  }

  dockerLogin();
  const pushResult = spawnSync(
    'docker-compose',
    ['-f', stackFile, 'push', ...services],
    {
      stdio: 'inherit',
    },
  );
  if (pushResult.status !== 0) {
    throw new Error('failed to push docker images');
  }
}

publish().catch((e) => {
  // tslint:disable-next-line:no-console
  console.error(e);
  process.exit(1);
});
