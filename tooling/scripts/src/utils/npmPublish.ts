import { spawnSync } from 'child_process';
import { resolve } from 'path';
import simpleGit from 'simple-git/promise';
import { updateMeta } from './updateMeta';

export const npmPublish = async (path: string) => {
  const git = simpleGit();
  const { current: branch } = await git.status();

  if (branch === 'master') {
    throw new Error('bumping packages is not allowed on master branch!');
  }
  const args = branch === 'dev' ? [] : ['--tag', 'next'];
  // set always-auth=true in ~/.npmrc
  const { status } = spawnSync(
    'npm',
    ['publish', '--access', 'public', ...args],
    {
      stdio: 'inherit',
      cwd: resolve(path),
      env: process.env,
    },
  );
  if (status !== 0) {
    throw new Error('failed to publish ' + path);
  }
  await updateMeta(path, 'published');
};
