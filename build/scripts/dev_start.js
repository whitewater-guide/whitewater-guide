#!/usr/bin/env node
const { spawn, spawnSync } = require('child_process');
const { ensureDirSync } = require('fs-extra');
const generateStackFile = require('./src/generateStackFile');
const setupEnv = require('./src/setupEnv');

const ENVIRONMENT = 'development';

async function devStart() {
  setupEnv(ENVIRONMENT);
  const stackFile = await generateStackFile(ENVIRONMENT, true);
  ensureDirSync('./packages/minio/data/temp');
  ensureDirSync('./packages/minio/data/media');
  ensureDirSync('./packages/minio/data/avatars');
  ensureDirSync('./packages/minio/config');
  process.on('SIGINT', () => {
    console.log('Terminating dev stack');
    spawnSync('docker-compose', ['-f', stackFile, 'down'], { stdio: 'inherit', shell: true });
  });
  // Temporary do not use docker-sync
  // spawn('docker-sync-stack', ['start'], { stdio: 'inherit', shell: true });
  spawn('docker-compose', ['-f', stackFile, 'up'], { stdio: 'inherit', shell: true });
}

devStart();
