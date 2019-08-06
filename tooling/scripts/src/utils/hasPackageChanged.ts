import { spawnSync } from 'child_process';
import { readJsonSync } from 'fs-extra';
import isEqual from 'lodash/isEqual';
import { resolve } from 'path';
import simpleGit from 'simple-git/promise';
import { WWMeta } from './types';

/**
 * This will git-diff current state of package with git hash with following exceptions:
 * - CHANGELOG.md is ignored
 * - package.json version is ignored
 */
const hasChangedSinceCommit = (path: string, hash: string) => {
  const { status } = spawnSync('git', [
    'diff-index',
    hash,
    '--quiet',
    '--',
    path,
    `":(exclude)${path}/CHANGELOG.md"`,
    `":(exclude)${path}/package.json"`,
  ]);
  const codeChanged = status !== 0;
  const { stdout } = spawnSync('git', ['show', `${hash}:${path}/package.json`]);
  const currentPJson = readJsonSync(`${path}/package.json`);
  const oldPJson = JSON.parse(stdout);
  currentPJson.version = 'ignore';
  oldPJson.version = 'ignore';
  const packageChanged = !isEqual(oldPJson, currentPJson);
  return codeChanged || packageChanged;
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
