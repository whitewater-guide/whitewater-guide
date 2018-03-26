const { spawnSync } = require('child_process');

/**
 * Checks if package (or entire project, if package name is not given) has changed. Uses git diff.
 * @param packageName
 * @returns {boolean}
 */
const hasChanged = (packageName) => {
  const changeRoot = packageName ? `./packages/${packageName}` : '.';
  // --cached flag allows to be used in pre-commit hooks
  const res = spawnSync('git', ['diff', '--cached', '--exit-code', '--quiet', changeRoot]);
  return res.status === 1;
};

module.exports = hasChanged;
