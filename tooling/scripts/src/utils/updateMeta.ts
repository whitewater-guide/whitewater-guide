import { readJsonSync, writeJsonSync } from 'fs-extra';
import { resolve } from 'path';
import simpleGit from 'simple-git/promise';
import { WWMeta } from './types';

/**
 * Updates metadata in package after it has been published
 * @param path
 */
export const updateMeta = async (path: string) => {
  const git = simpleGit();
  const status = await git.status();
  if (!status.isClean()) {
    throw new Error(`failed to update meta at ${path}: working tree is dirty`);
  }
  const branch = status.current;
  const hash = await git.revparse(['HEAD']);

  const mJsonPath = resolve(path, 'ww-meta.json');
  const pJsonPath = resolve(path, 'package.json');
  let meta: WWMeta = { branches: {} };
  const pJson = readJsonSync(pJsonPath, { throws: false });
  if (!pJson) {
    return;
  }
  try {
    meta = readJsonSync(mJsonPath);
  } catch {}
  meta.branches[branch] = {
    version: pJson.version,
    hash,
  };
  writeJsonSync(mJsonPath, meta, { spaces: 2 });
};
