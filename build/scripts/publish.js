#!/usr/bin/env node

const { spawnSync } = require('child_process');
const { argv } = require('yargs');
const generateStackFile = require('./src/generateStackFile');
const setupEnv = require('./src/setupEnv');
const tagImages = require('./src/tagImages');
const pushImages = require('./src/pushImages');
const hasChanged = require('./src/hasChanged');

async function publish() {
  // ---------- parse cli arguments
  const environment = argv.env;
  if (!environment) {
    console.error('Environment (local/staging/production) is required. Specify via --env');
    return;
  }
  const noCommit = argv.noCommit; // Ignore uncommitted git protection
  // Build fresh images for all (default) or some (specify via --service flags) services
  // Multiple flags allowed, e.g. --service caddy --service db
  let services = [];
  if (argv.service) {
    services = Array.isArray(argv.service) ? argv.service : [argv.service];
  }
  // ------------- cli arguments parsed

  if (hasChanged() && !noCommit) {
    console.error('\n\nCommit all changes before updating docker stack');
    return;
  }

  // Set environment variables for build-time substitution in compose files
  setupEnv(environment);
  // Merge docker-compose.yml and docker-compose.local.yml
  const stackFile = await generateStackFile(environment);

  // Ensure that backend is compiled
  if (services.length === 0 || services.includes('backend')) {
    const tscResult = spawnSync('yarn', ['run', 'tsc'], { cwd: 'packages/backend', stdio: 'inherit' });
    if (tscResult.status !== 0) {
      console.log('\n\nFailed to compile backend, please fix');
      return;
    }
  }

  // Ensure that web is compiled
  if (services.length === 0 || services.includes('web')) {
    const tscResult = spawnSync('yarn', ['run', 'build'], { cwd: 'packages/web', stdio: 'inherit' });
    if (tscResult.status !== 0) {
      console.log('\n\nFailed to compile web, please fix');
      return;
    }
  }

  // Ensure that boompromo is compiled
  if (services.length === 0 || services.includes('boompromo')) {
    const tscResult = spawnSync('yarn', ['run', 'build'], { cwd: 'packages/boompromo', stdio: 'inherit' });
    if (tscResult.status !== 0) {
      console.log('\n\nFailed to compile web, please fix');
      return;
    }
  }

  // Build images (locally)
  const buildRes = spawnSync(
    'docker-compose',
    ['-f', stackFile, 'build', ...services],
    { stdio: 'inherit' },
  );
  if (buildRes.status !== 0) {
    console.log('\n\nFailed to build docker images');
    return;
  }

  // Tag images
  const taggedImages = tagImages(environment);
  // Push images to AWS ECR
  pushImages(taggedImages, services);
}

publish();
