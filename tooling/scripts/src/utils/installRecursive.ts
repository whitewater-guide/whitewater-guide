import { spawnSync } from 'child_process';
import { readJsonSync } from 'fs-extra';
import glob from 'glob';
import { resolve } from 'path';
import simpleGit from 'simple-git/promise';
import { info } from './info';
import { Package } from './types';

/**
 * Installs given packages in given paths
 * @param what array of packages with versions
 * @param where array of globs for directories to install in (e.g. ['packages/mobile', 'services/*'])
 */
export const installRecursive = async (what: Package[], where: string[]) => {
  const git = simpleGit();
  const destinations: string[] = where.reduce(
    (acc, w) => [...acc, ...glob.sync(w)],
    [],
  );
  for (const dest of destinations) {
    const pJsonPath = resolve(dest, 'package.json');
    const pJson = readJsonSync(pJsonPath, { throws: false });
    if (!pJson || !pJson.dependencies) {
      continue;
    }
    const toInstall = what.filter(({ name }) => !!pJson.dependencies[name]);
    const toInstallStr = toInstall.map((pkg) => pkg.toString());
    if (toInstall.length === 0) {
      continue;
    }
    info(
      'Installing ' +
        toInstall.map((p) => p.pretty()).join(', ') +
        ' in ' +
        new Package(pJson.name, pJson.version).pretty() +
        ' ...',
    );
    const { status } = spawnSync(
      'yarn',
      ['add', ...toInstallStr, '--ignore-scripts'],
      {
        cwd: dest,
        stdio: 'inherit',
        env: process.env,
      },
    );
    await git.add([resolve(dest, 'package.json'), resolve(dest, 'yarn.lock')]);

    if (status !== 0) {
      throw new Error(`failed to install ${toInstall} in ${pJson.name}`);
    }
    await git.add(pJsonPath);
  }
};
