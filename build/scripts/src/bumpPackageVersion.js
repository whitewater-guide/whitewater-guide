const { spawnSync } = require('child_process');

/**
 * Bumps pacth version in package.json of package or entire project, if package name is not given
 * @param packageName
 */
const bumpPackageVersion = (packageName) => {
  const path = packageName ? `./packages/${packageName}` : '.';
  spawnSync(
    'npm',
    ['version', 'patch', '--no-git-tag-version'],
    { stdio: 'inherit', cwd: path },
  );
};

module.exports = bumpPackageVersion;
