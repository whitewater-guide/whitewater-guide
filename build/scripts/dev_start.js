#!/usr/bin/env node
const { spawn } = require('child_process');
const generateStackFile = require('./src/generateStackFile');
const setupEnv = require('./src/setupEnv');

const CONFIG_NAME = 'development';

async function devStart() {
  setupEnv(CONFIG_NAME);
  await generateStackFile(CONFIG_NAME);
  spawn('docker-sync-stack', ['start'], { stdio: 'inherit', shell: true });
}

devStart();
