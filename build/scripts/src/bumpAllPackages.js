const hasChanged = require('./hasChanged');
const bumpPackageVersion = require('./bumpPackageVersion');
const { DEPENDENCIES, PACKAGES } = require('./constants');

/**
 * Bumps versions of all changed packages and whole project
 */
const bumpAllPackages = () => {
  const changes = new Map(PACKAGES.map(packageName => [packageName, hasChanged(packageName)]));
  changes.forEach((changed, packageName) => {
    const deps = DEPENDENCIES[packageName];
    if (changed || deps.some(dep => changes.get(dep))) {
      bumpPackageVersion(packageName);
    }
  });
  const prjChanged = hasChanged();
  if (prjChanged) {
    bumpPackageVersion();
  }
};

module.exports = bumpAllPackages;
