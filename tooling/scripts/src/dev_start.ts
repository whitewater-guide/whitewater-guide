#!/usr/bin/env node
import { spawn, spawnSync } from 'child_process';
import { ensureDirSync } from 'fs-extra';
import rimraf from 'rimraf';
import { EnvType } from './types';
import { generateStackFile, setupEnv } from './utils';

async function devStart() {
  setupEnv(EnvType.DEVELOPMENT);
  const stackFile = await generateStackFile(EnvType.DEVELOPMENT);
  ensureDirSync('./dev-mount/minio/data');
  ensureDirSync('./dev-mount/minio/config');
  ensureDirSync('./dev-mount/minio/log');
  ensureDirSync('./dev-mount/workers/cache');
  ensureDirSync('./dev-mount/workers/cookies');
  ensureDirSync('./dev-mount/imagecache');
  try {
    rimraf.sync('./dev-mount/minio/log/minio.log');
  } catch {}

  // empty the pgdata volume
  spawnSync('docker volume rm config_ww-db-pgdata');
  spawnSync('docker volume create config_ww-db-pgdata');

  process.on('SIGINT', () => {
    console.info('Terminating dev stack');
    spawnSync('docker-compose', ['-f', stackFile, 'down'], {
      shell: true,
      stdio: 'inherit',
    });
  });
  // Temporary do not use docker-sync
  // spawn('docker-sync-stack', ['start'], { stdio: 'inherit', shell: true });
  spawn('docker-compose', ['-f', stackFile, 'up'], {
    shell: true,
    stdio: 'inherit',
  });
}

devStart();
