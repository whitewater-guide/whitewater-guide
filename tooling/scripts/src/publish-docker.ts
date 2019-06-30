import { spawnSync } from 'child_process';
import simpleGit from 'simple-git/promise';
import { argv } from 'yargs';
import { EnvType } from './types';
import {
  bumpPackage,
  dockerLogin,
  generateStackFile,
  getChangedServices,
  gitGuardian,
  setupEnv,
  updateMeta,
} from './utils';
import { Package } from './utils/types';

async function publish() {
  const git = simpleGit();
  const { current } = await git.branchLocal();
  const env =
    current === 'dev' || current === 'master' ? EnvType.STAGING : EnvType.LOCAL;
  // Images can be published from any branch
  await gitGuardian(env);

  // Set environment variables for build-time substitution in compose files
  setupEnv(env);
  // Merge docker-compose files
  const stackFile = await generateStackFile(env);

  let services: string[] = await getChangedServices();
  if (services.length === 0 && !argv.service) {
    return;
  }
  // it's possible to explicitly list services to publish
  // via one or many --service arguments
  if (argv.service) {
    services = Array.isArray(argv.service)
      ? argv.service
      : argv.service === '*'
      ? []
      : [argv.service];
  }

  const packages: Package[] = [];
  for (const service of services) {
    // this will also run preversion/postversion scripts
    const pkg = await bumpPackage(`services/${service}`);
    if (pkg) {
      packages.push(pkg);
    }
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

  await git.commit('chore: publish' + packages.join(', '), undefined, {
    '--no-verify': null,
  });

  for (const service of services) {
    await updateMeta(`services/${service}`);
  }
}

publish().catch((e) => {
  // tslint:disable-next-line:no-console
  console.error(e);
  process.exit(1);
});
