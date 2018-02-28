const { spawnSync } = require('child_process');

/**
 * Builds and tags workers image
 * @returns {Promise<void>}
 */
const buildWorkers = () => {
  const { status, stderr } = spawnSync(
    'docker',
    ['build', '-t', `ww-workers:${process.env.WORKERS_TAG}`, '.'],
    {
      stdio: 'inherit',
      cwd: 'packages/workers',
    },
  );
  if (status !== 0) {
    throw new Error(stderr);
  }
};

module.exports = buildWorkers;
