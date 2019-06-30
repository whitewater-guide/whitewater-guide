import { spawnSync } from 'child_process';
import { readJsonSync } from 'fs-extra';
import { resolve } from 'path';
import { inc } from 'semver';
import simpleGit from 'simple-git/promise';
import { Package } from './types';

/**
 * Increases the version of package at given path
 * Increments patch version (0.0.xxx) on dev branch
 * Increments prerelease version on other dev branches (0.0.1-branch.xxx)
 *
 * @param path
 */
export const bumpPackage = async (path: string): Promise<Package> => {
  const pJsonPath = resolve(path, 'package.json');
  const pJson = readJsonSync(pJsonPath);
  const { name, version } = pJson;
  const git = simpleGit();
  const { current: branch } = await git.status();

  if (branch === 'master') {
    throw new Error('bumping packages is not allowed on master branch!');
  }
  const newVersion = inc(
    version,
    branch === 'dev' ? 'patch' : 'prerelease',
    false,
    branch,
  );
  const { status } = spawnSync('npm', ['version', newVersion!], {
    cwd: resolve(path),
    env: process.env,
  });

  if (status !== 0) {
    throw new Error(`failed to bump ${name} version to ${newVersion}!`);
  }

  await git.add(pJsonPath);

  return new Package(name, newVersion!);
};
