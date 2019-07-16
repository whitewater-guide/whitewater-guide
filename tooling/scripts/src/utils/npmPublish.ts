import { spawnSync } from 'child_process';
import { readJsonSync } from 'fs-extra';
import { resolve } from 'path';
import simpleGit from 'simple-git/promise';
import { info } from './info';
import { Package } from './types';

/**
 * Publishes given package on NPM
 * @param path e.g. packages/commons
 */
export const npmPublish = async (path: string) => {
  const git = simpleGit();
  const { current: branch } = await git.status();

  if (branch === 'master') {
    throw new Error('bumping packages is not allowed on master branch!');
  }
  const { version, name } = readJsonSync(resolve(path, 'package.json'));
  const pkg = new Package(name, version);
  info('Publishing ' + pkg.pretty() + ' ...');
  const args = branch === 'dev' ? [] : ['--tag', 'next'];
  // set always-auth=true in ~/.npmrc
  const { status, stderr } = spawnSync(
    'npm',
    ['publish', '--access', 'public', ...args],
    {
      cwd: resolve(path),
      stdio: 'inherit',
      env: process.env,
    },
  );

  if (status !== 0) {
    throw new Error(`failed to publish ${pkg}: ${stderr}`);
  }
  info('Published ' + pkg.pretty());
};
