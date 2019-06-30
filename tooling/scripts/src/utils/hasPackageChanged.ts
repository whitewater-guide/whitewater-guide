import { spawnSync } from 'child_process';
import { readJsonSync } from 'fs-extra';
import { resolve } from 'path';
import simpleGit from 'simple-git/promise';
import { WWMeta } from './types';

const hasChangedSinceCommit = (path: string, hash: string) => {
  const { status } = spawnSync('git', ['diff-index', hash, '--quiet', path]);
  return status !== 0;
};

/**
 * Checks if packages has been changed since last time it was published
 * The moment of last publication is determined by commit hash in ww-meta.json
 * @param path
 */
export const hasPackageChanged = async (path: string) => {
  try {
    const git = simpleGit();
    const { current: branch } = await git.status();
    const meta: WWMeta = readJsonSync(resolve(path, 'ww-meta.json'));
    const { hash } = meta.branches[branch]!;
    return hash ? hasChangedSinceCommit(path, hash) : true;
  } catch {
    return true;
  }
};
