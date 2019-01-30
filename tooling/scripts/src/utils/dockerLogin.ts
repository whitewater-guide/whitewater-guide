import { execSync, spawnSync } from 'child_process';

/**
 * Gets AWS ECR (private docker registry) credentials via aws cli
 * Uses them to docker-login into this registry
 */
export const dockerLogin = (readOnly?: boolean) => {
  const env = { ...process.env };
  if (readOnly) {
    env.AWS_ACCESS_KEY_ID = env.AWS_ECR_READER_ACCESS_KEY; // from .aws-ecr file
    env.AWS_SECRET_ACCESS_KEY = env.AWS_ECR_READER_SECRET_KEY; // from .aws-ecr file
  }
  execSync('docker logout', { stdio: 'inherit' });
  if (!env.AWS_REGION) {
    throw new Error('AWS region not found in env');
  }

  const { stdout, stderr, status } = spawnSync(
    'aws',
    ['ecr', 'get-login', '--no-include-email', '--region', env.AWS_REGION],
    { env },
  );
  if (status !== 0) {
    throw new Error(`Failed to get AWS ECR login: ${stderr}`);
  }
  const loginCmd = stdout.toString();
  execSync(loginCmd, { stdio: 'inherit' }); //  this will throw in case of error
};
