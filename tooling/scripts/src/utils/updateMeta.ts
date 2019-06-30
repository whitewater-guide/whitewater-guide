import { readJsonSync, writeJsonSync } from 'fs-extra';
import { resolve } from 'path';
import simpleGit from 'simple-git/promise';
import { WWMeta } from './types';

export const updateMeta = async (
  path: string,
  type: 'published' | 'deployed',
) => {
  const git = simpleGit();
  const { current: branch } = await git.status();
  const hash = await git.revparse(['HEAD']);

  const mJsonPath = resolve(path, 'ww-meta.json');
  const pJsonPath = resolve(path, 'package.json');
  let meta: WWMeta = { branches: {} };
  const pJson = readJsonSync(pJsonPath);
  try {
    meta = readJsonSync(mJsonPath);
  } catch {}
  meta.branches[branch] = {
    ...meta.branches[branch],
    [type]: {
      version: pJson.version,
      hash,
    },
  };
  writeJsonSync(mJsonPath, meta, { spaces: 2 });
};
