const path = require('path');
const { readdirSync, readFileSync } = require('fs');

/**
 * Looks through packages of this monorepo and return object that provides ENV vars
 * to be substituded inside docker-compose and used for tagging images
 * @param postfix Optional postfix, e.g. 'prod' or 'dev'
 * @returns {{}}
 */
const getContainerTags = (postfix) => {
  const packages = readdirSync('packages');
  const env = {};
  packages.forEach((pkg) => {
    const rawPkgJson = readFileSync(path.resolve('packages', pkg, 'package.json'), { encoding: 'utf8' });
    const { version } = JSON.parse(rawPkgJson);
    env[`${pkg.toUpperCase()}_TAG`] = postfix ? `${version}.${postfix}` : version;
  });
  return env;
};

module.exports = getContainerTags;
