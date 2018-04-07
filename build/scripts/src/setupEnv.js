const dotenv = require('dotenv');
const path = require('path');

/**
 * Set process.env from .env.xxxx file and also generates image tags for all packages
 * @param configName
 */
const setupEnv = (configName) => {
  const envFile = `.env.${configName}`;
  process.env.DOCKER_ENV_FILE = envFile; // This is for yml anchors
  process.env.DOCKER_ENVIRONMENT = configName; // This is for docker-compose.deploy.substitution

  // This sets DOCKER_REGISTRY_PREFIX
  const awsEnvPath = path.resolve(process.cwd(), 'build/.aws-ecr');
  dotenv.load({ path: awsEnvPath });
};

module.exports = setupEnv;
