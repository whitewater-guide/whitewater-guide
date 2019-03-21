import { spawn, spawnSync } from 'child_process';
import { CONFIG_DIR } from './constants';
import { preStart } from './utils';

function testStart() {
  preStart();

  const stackFile = `${CONFIG_DIR}/docker-compose.test.yml`;

  process.on('SIGINT', () => {
    console.info('Terminating dev stack');
    spawnSync('docker-compose', ['-f', stackFile, 'down'], {
      shell: true,
      stdio: 'inherit',
    });
  });
  spawn('docker-compose', ['-f', stackFile, 'up'], {
    shell: true,
    stdio: 'inherit',
  });
}

testStart();
