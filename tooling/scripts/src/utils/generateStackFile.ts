import { spawn } from 'child_process';
import { createWriteStream } from 'fs';
import { CONFIG_DIR } from '../constants';
import { EnvType } from '../types';

/**
 * Takes two docker-compose file (base file and override config file), merges them together
 * Also substitutes ENV variables in those file to tag images with correct versions
 * @param environment development/local/staging/production
 * @param noDeploy additional flag to distinguish dev env from other envs that use AWS ECR
 * @returns {Promise<string>} resulting stack .yml
 */
export const generateStackFile = async (environment: EnvType) =>
  new Promise<string>((resolve, reject) => {
    const stackFile = `${CONFIG_DIR}/docker-stack-${environment}.yml`;

    const configs = [
      '-f',
      `${CONFIG_DIR}/docker-compose.yml`,
      '-f',
      `${CONFIG_DIR}/docker-compose.deploy.yml`,
      '-f',
      `${CONFIG_DIR}/docker-compose.${environment}.yml`,
    ];
    if (environment === 'development') {
      configs.splice(2, 2);
    }

    const output = createWriteStream(stackFile);
    output.on('open', () => {
      const compose = spawn('docker-compose', [...configs, 'config'], {
        stdio: ['ignore', output, 'inherit'],
      });
      compose.on('error', (err) => reject(err));
      compose.on('exit', (code) => {
        if (code) {
          reject(code);
        } else {
          resolve(stackFile);
        }
      });
    });
  });
