const { createWriteStream } = require('fs');
const { spawn } = require('child_process');

/**
 * Takes two docker-compose file (base file and override config file), merges them together
 * Also substitutes ENV variables in those file to tag images with correct versions
 * @param environment development/local/staging/production
 * @param noDeploy additional flag to distinguish dev env from other envs that use AWS ECR
 * @returns {Promise<string>} resulting stack .yml
 */
const generateStackFile = async (environment, noDeploy) => new Promise((resolve, reject) => {
  const stackFile = `build/docker-stack-${environment}.yml`;

  const configs = [
    '-f', 'build/docker-compose.yml',
    '-f', 'build/docker-compose.deploy.yml',
    '-f', `build/docker-compose.${environment}.yml`,
  ];
  if (noDeploy) {
    configs.splice(2, 2);
  }

  const output = createWriteStream(stackFile);
  output.on('open', () => {
    const compose = spawn(
      'docker-compose',
      [...configs, 'config'],
      { stdio: ['ignore', output, 'inherit'] },
    );
    compose.on('error', err => reject(err));
    compose.on('exit', (code) => {
      if (code) {
        reject(code);
      } else {
        resolve(stackFile);
      }
    });
  });
});

module.exports = generateStackFile;
