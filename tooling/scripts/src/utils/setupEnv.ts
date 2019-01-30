import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { CONFIG_DIR } from '../constants';
import { EnvType } from '../types';

/**
 * Set process.env from .env.xxxx file and also generates image tags for all services
 * @param configName
 */
export const setupEnv = (configName: EnvType) => {
  const envFile = `.env.${configName}`;
  process.env.DOCKER_ENV_FILE = envFile; // This is for yml anchors
  process.env.DOCKER_ENVIRONMENT = configName; // This is for docker-compose.deploy.substitution

  // This sets DOCKER_REGISTRY_PREFIX
  const awsEnvPath = path.resolve(process.cwd(), `${CONFIG_DIR}/.aws-ecr`);
  dotenv.load({ path: awsEnvPath });

  const servicesDir = path.resolve(process.cwd(), 'services');
  const serviceNames = fs.readdirSync(servicesDir);
  for (const service of serviceNames) {
    const stat = fs.lstatSync(path.resolve(servicesDir, service));
    if (!stat.isDirectory()) {
      continue;
    }
    const pjsonPath = path.resolve(servicesDir, service, 'package.json');
    try {
      const pjson = JSON.parse(fs.readFileSync(pjsonPath, 'utf-8'));
      process.env[`${service.toUpperCase()}_VERSION`] = pjson.version;
    } catch {}
  }
};
