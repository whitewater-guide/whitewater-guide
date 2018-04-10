#!/usr/bin/env node

const { PACKAGES } = require('./src/constants');
const { spawnSync } = require('child_process');
const { chmodSync, statSync, constants } = require('fs');

// see https://stackoverflow.com/questions/48766328/git-pre-commit-hook-behavior-with-intellij-idea/48790009#48790009
function postCommitHook() {
  // TODO: also commit git secret keys
  spawnSync(
    'git',
    [
      'add',
      'package.json',
      ...PACKAGES.map(pkg => `packages/${pkg}/package.json`),
    ],
    { stdio: 'inherit' },
  );

  // Temporary remove exec permissions from post-commit hook
  const POST_COMMIT_HOOK = '.git/hooks/post-commit';
  const { mode } = statSync(POST_COMMIT_HOOK);
  const noExec = mode & ~(constants.S_IXUSR | constants.S_IXGRP | constants.S_IXOTH);
  chmodSync(POST_COMMIT_HOOK, noExec);

  spawnSync(
    'git',
    ['commit', '--amend', '--no-verify', '-C', 'HEAD'],
    { stdio: 'inherit' },
  );

  // Set permissions back
  chmodSync(POST_COMMIT_HOOK, mode);
}

postCommitHook();
