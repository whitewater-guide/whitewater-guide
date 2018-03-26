#!/usr/bin/env node
const { spawnSync } = require('child_process');
const bumpAllPackages = require('./src/bumpAllPackages');

function preCommitHook() {
  bumpAllPackages();
  // Encrypt all secrets (only if they change = -m)
  spawnSync(
    'git',
    ['secret', 'hide', '-m'],
    { stdio: 'inherit' },
  );
}

preCommitHook();
