const path = require('path');
const { readdirSync, readFileSync } = require('fs');
const { spawnSync } = require('child_process');

/**
 * For each package find last built image (moving tag) and tag is with version from packages json
 * @param environment local/staging/production
 * @returns Array of both moving and versioned tags
 */
const tagImages = (environment) => {
  const packages = readdirSync('packages');
  const images = [];
  packages.forEach((pkg) => {
    const rawPkgJson = readFileSync(path.resolve('packages', pkg, 'package.json'), { encoding: 'utf8' });
    const { version } = JSON.parse(rawPkgJson);
    const movingTag = `${process.env.DOCKER_REGISTRY_PREFIX}${pkg}:${environment}`;
    const versionedTag = `${movingTag}.${version}`;
    // This will attempt to tag non-existing images, such as commons and clients
    try {
      spawnSync(
        'docker',
        ['tag', movingTag, versionedTag],
        { stdio: 'inherit' },
      );
      console.log(`Tagged ${movingTag} as ${versionedTag}`);
      images.push(movingTag, versionedTag);
    } catch (e) {
      console.log(`Failed to tag ${movingTag} as ${versionedTag}`);
    }
  });
  return images;
};

module.exports = tagImages;
