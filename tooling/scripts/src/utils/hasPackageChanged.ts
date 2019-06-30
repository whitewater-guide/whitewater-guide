import { spawnSync } from 'child_process';
import { readJsonSync } from 'fs-extra';
import { resolve } from 'path';
import simpleGit from 'simple-git/promise';
import { WWMeta } from './types';

const hasChangedSinceCommit = (path: string, hash: string) => {
  const { status } = spawnSync('git', ['diff-index', hash, '--quiet', path]);
  return status !== 0;
};

export const hasPackageChanged = async (
  path: string,
  type: 'published' | 'deployed',
) => {
  try {
    const git = simpleGit();
    const { current: branch } = await git.status();
    const meta: WWMeta = readJsonSync(resolve(path, 'ww-meta.json'));
    const { hash } = meta.branches[branch][type]!;
    return hash ? hasChangedSinceCommit(path, hash) : true;
  } catch {
    return true;
  }
};
