const { spawnSync } = require('child_process');

/**
 * Bumps patch version in package.json of package or entire project, if package name is not given
 * For mobile version, bumps prerelease version - check mobile README for versioning scheme
 * @param packageName
 */
const bumpPackageVersion = (packageName) => {
  const path = packageName ? `./packages/${packageName}` : '.';
  const semver = packageName === 'mobile' ? 'prerelease' : 'patch';
  spawnSync(
    'npm',
    ['version', semver, '--no-git-tag-version'],
    { stdio: 'inherit', cwd: path },
  );
};

module.exports = bumpPackageVersion;
