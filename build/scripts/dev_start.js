#!/usr/bin/env node
const generateStackFile = require('./src/generateStackFile');
const { spawn } = require('child_process');

async function devStart() {
  await generateStackFile('development');
  spawn('docker-sync-stack', ['start'], { stdio: 'inherit', shell: true });
}

devStart();
