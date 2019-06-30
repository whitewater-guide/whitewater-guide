import chalk from 'chalk';
import { spawnSync } from 'child_process';
import { readJsonSync } from 'fs-extra';
import { resolve } from 'path';
import simpleGit from 'simple-git/promise';

export const npmPublish = async (path: string) => {
  const git = simpleGit();
  const { current: branch } = await git.status();

  if (branch === 'master') {
    throw new Error('bumping packages is not allowed on master branch!');
  }
  const { version, name } = readJsonSync(resolve(path, 'package.json'));
  console.info(
    'Publishing ' +
      chalk.white(name) +
      chalk.yellow('@') +
      chalk.white(version) +
      ' ...',
  );
  const args = branch === 'dev' ? [] : ['--tag', 'next'];
  // set always-auth=true in ~/.npmrc
  const { status, stderr } = spawnSync(
    'npm',
    ['publish', '--access', 'public', ...args],
    {
      cwd: resolve(path),
      env: process.env,
    },
  );

  if (status !== 0) {
    throw new Error(`failed to publish ${name}@${version}: ${stderr}`);
  }
  console.info(
    'Published ' + chalk.white(name) + chalk.yellow('@') + chalk.white(version),
  );
};
