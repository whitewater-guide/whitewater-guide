#!/usr/bin/env node
import { spawn, spawnSync } from 'child_process';
import { EnvType } from './types';
import { generateStackFile, preStart, setupEnv } from './utils';

async function devStart() {
  preStart();

  setupEnv(EnvType.DEVELOPMENT);
  const stackFile = await generateStackFile(EnvType.DEVELOPMENT);

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

devStart().catch(() => process.exit(1));
