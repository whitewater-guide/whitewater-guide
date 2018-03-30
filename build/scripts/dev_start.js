#!/usr/bin/env node
const { spawn, spawnSync } = require('child_process');
const generateStackFile = require('./src/generateStackFile');
const setupEnv = require('./src/setupEnv');

const CONFIG_NAME = 'development';

async function devStart() {
  setupEnv(CONFIG_NAME);
  const stackFile = await generateStackFile(CONFIG_NAME);
  process.on('SIGINT', () => {
    console.log('Terminating dev stack');
    spawnSync('docker-compose', ['-f', stackFile, 'down'], { stdio: 'inherit', shell: true });
  });
  // Temporary do not use docker-sync
  // spawn('docker-sync-stack', ['start'], { stdio: 'inherit', shell: true });
  spawn('docker-compose', ['-f', stackFile, 'up'], { stdio: 'inherit', shell: true });
}

devStart();
