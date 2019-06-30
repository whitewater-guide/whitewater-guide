import { spawnSync } from 'child_process';
import { readJsonSync } from 'fs-extra';
import glob from 'glob';
import { resolve } from 'path';
import simpleGit from 'simple-git/promise';

export const installRecursive = async (what: string[], where: string[]) => {
  const git = simpleGit();
  const destinations: string[] = where.reduce(
    (acc, w) => [...acc, ...glob.sync(w)],
    [],
  );
  for (const dest of destinations) {
    const pJsonPath = resolve(dest, 'package.json');
    const pJson = readJsonSync(pJsonPath);
    const toInstall = what.filter((p) => !!pJson.dependencies[p]);
    if (toInstall.length === 0) {
      continue;
    }
    const { status } = spawnSync('yarn', ['add', ...toInstall], {
      stdio: 'inherit',
      cwd: dest,
    });

    if (status !== 0) {
      throw new Error(`failed to install ${toInstall} in ${pJson.name}`);
    }
    await git.add(pJsonPath);
  }
};
