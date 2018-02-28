const getContainerTags = require('./getContainerTags');

/**
 * Set process.env from .env.xxxx file and also generates image tags for all packages
 * @param configName
 */
const setupEnv = (configName) => {
  const envFile = `.env.${configName}`;
  process.env.DOCKER_ENV_FILE = envFile; // This is for yml anchors
  const tags = getContainerTags(configName); // This is for tagging images in yml
  Object.entries(tags).forEach(([key, value]) => { process.env[key] = value; });
};

module.exports = setupEnv;
