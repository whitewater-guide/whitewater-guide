import chalk from 'chalk';
import { spawnSync } from 'child_process';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { CONFIG_DIR } from './constants';
import { dockerLogin, imageExistsInECR } from './utils';

/**
 * Builds docker image from Dockerfile in working directory
 * The tags built image using:
 * - version from package.json
 * - directory name as image name
 * - AWS ECR prefix from global secret config
 * Then pushes it to AWS ECR
 */
async function dockerPublish() {
  const pjsonPath = path.resolve(process.cwd(), 'package.json');
  const pjson = JSON.parse(fs.readFileSync(pjsonPath, 'utf-8'));
  const version: string = pjson.version;
  const service: string = path.basename(process.cwd());
  console.info(
    chalk.grey(`Running postpublish-docker for ${service} v${version}`),
  );
  const awsEnvPath = path.resolve(
    process.cwd(),
    '../../',
    CONFIG_DIR,
    '.aws-ecr',
  );
  dotenv.load({ path: awsEnvPath });
  const alreadyExists = await imageExistsInECR(service, version);
  if (alreadyExists) {
    console.info(chalk.grey(`Should not publish ${service} v${version}`));
    return;
  }
  console.info(chalk.green(`Publishing ${service} v${version}`));
  const tag = `${process.env.DOCKER_REGISTRY_PREFIX}${service}:${version}`;

  const buildResult = spawnSync(
    'docker',
    ['build', '--tag', tag, '--label', 'guide.whitewater', '.'],
    { stdio: 'inherit' },
  );
  if (buildResult.status !== 0) {
    throw new Error(`DOCKER BUILD FAILED: ${buildResult.stderr}`);
  }
  dockerLogin();
  const pushResult = spawnSync('docker', ['push', tag], { stdio: 'inherit' });
  if (pushResult.status !== 0) {
    throw new Error(`DOCKER PUSH FAILED: ${pushResult.stderr}`);
  }
}

dockerPublish().catch((e) => {
  // tslint:disable-next-line:no-console
  console.error(e);
  process.exit(1);
});
