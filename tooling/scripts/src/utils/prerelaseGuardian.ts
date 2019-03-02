import fs from 'fs';
import { readJSON } from 'fs-extra';
import path from 'path';
import { prerelease } from 'semver';
import { EnvType } from '../types';

/**
 * Packages with prerelease versions (e.g. 0.1.1-alpha.1) are only allowed to be deployed onto ww-local machine
 * @param env
 */
export const prerelaseGuardian = async (env: EnvType) => {
  if (env === EnvType.DEVELOPMENT || env === EnvType.LOCAL) {
    return;
  }
  const servicesDir = path.resolve(process.cwd(), 'services');
  const serviceNames = fs.readdirSync(servicesDir);
  for (const service of serviceNames) {
    const stat = fs.lstatSync(path.resolve(servicesDir, service));
    if (!stat.isDirectory()) {
      continue;
    }
    const pjson = await readJSON(
      path.resolve(servicesDir, service, 'package.json'),
    );
    const pr = prerelease(pjson.version);
    if (pr !== null && pr.length !== 0) {
      throw new Error(
        `prereleases are only allowed in local environment, got ${service}@${
          pjson.version
        }`,
      );
    }
  }
};
