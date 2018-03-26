const { readdirSync } = require('fs');
const hasChanged = require('./hasChanged');
const bumpPackageVersion = require('./bumpPackageVersion');

const DEPENDENCIES = {
  'backend': ['commons'],
  'caddy': [],
  'clients': ['commons'],
  'commons': [],
  'db': [],
  'minio': [],
  'mongo-to-postgres': [],
  'web': ['clients', 'commons'],
  'workers': [],
};

/**
 * Bumps versions of all changed packages and whole project
 */
const bumpAllPackages = () => {
  const packages = readdirSync('packages');
  const changes = new Map(packages.map(packageName => [packageName, hasChanged(packageName)]));
  console.log('Changes:', changes);
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
