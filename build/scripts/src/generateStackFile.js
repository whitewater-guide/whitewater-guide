const { createWriteStream } = require('fs');
const { spawn } = require('child_process');

/**
 * Takes two docker-compose file (base file and override config file), merges them together
 * Also substitutes ENV variables in those file to tag images with correct versions
 * @param configName
 * @returns {Promise<string>} resulting stack .yml
 */
const generateStackFile = async configName => new Promise((resolve, reject) => {
  const stackFile = `build/docker-stack-${configName}.yml`;
  const output = createWriteStream(stackFile);
  output.on('open', () => {
    const compose = spawn(
      'docker-compose',
      ['-f', 'build/docker-compose.yml', '-f', `build/docker-compose.${configName}.yml`, 'config'],
      {
        stdio: ['ignore', output, 'inherit'],
      },
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
