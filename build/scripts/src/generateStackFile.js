const getContainerTags = require('./getContainerTags');
const { createWriteStream } = require('fs');
const { spawn } = require('child_process');

/**
 * Takes two docker-compose file (base file and override config file), merges them together
 * Also substitutes ENV variables in those file to tag images with correct versions
 * @param configName
 * @returns {Promise<any>}
 */
const generateStackFile = async configName => new Promise((resolve, reject) => {
  const env = getContainerTags(configName);
  const output = createWriteStream(`build/docker-stack-${configName}.yml`);
  output.on('open', () => {
    const compose = spawn(
      'docker-compose',
      ['-f', 'build/docker-compose.yml', '-f', `build/docker-compose.${configName}.yml`, 'config'],
      {
        env: Object.assign({ DOCKER_ENV_FILE: `.env.${configName}` }, process.env, env),
        stdio: ['ignore', output, 'inherit'],
      },
    );
    compose.on('error', err => reject(err));
    compose.on('exit', (code) => {
      if (code) {
        reject(code);
      } else {
        resolve();
      }
    });
  });
});

module.exports = generateStackFile;
