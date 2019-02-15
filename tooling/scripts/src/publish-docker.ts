import { spawnSync } from 'child_process';
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

  const services = getChangedServices();

  const buildRes = spawnSync(
    'docker-compose',
    ['-f', stackFile, 'build', ...services],
    { stdio: 'inherit' },
  );
  if (buildRes.status !== 0) {
    throw new Error('failed to build docker images');
  }

  dockerLogin();
  const pushResult = spawnSync('docker-compose', ['-f', stackFile, 'push'], {
    stdio: 'inherit',
  });
  if (pushResult.status !== 0) {
    throw new Error('failed to push docker images');
  }
}

publish().catch((e) => {
  // tslint:disable-next-line:no-console
  console.error(e);
  process.exit(1);
});
