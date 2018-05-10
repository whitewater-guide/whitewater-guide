const { execSync, spawnSync } = require('child_process');

/**
 * Gets AWS ECR (private docker registry) credentials via aws cli
 * Uses them to docker-login into this registry
 */
const dockerLogin = (readOnly) => {
  const env = { ...process.env };
  if (readOnly) {
    env.AWS_ACCESS_KEY_ID = env.AWS_ECR_READER_ACCESS_KEY; // from .aws-ecr file
    env.AWS_SECRET_ACCESS_KEY = env.AWS_ECR_READER_SECRET_KEY; // from .aws-ecr file
  }
  execSync('docker logout', { stdio: 'inherit' });

  const { stdout, stderr, status } = spawnSync(
    'aws',
    ['ecr', 'get-login', '--no-include-email', '--region', 'ap-south-1'],
    { env },
  );
  if (status !== 0) {
    console.error('failed to get awc ecr login', stderr);
    throw new Error(stderr);
  }
  const loginCmd = stdout.toString();
  execSync(loginCmd, { stdio: 'inherit' }); //  this will throw in case of error
};

module.exports = dockerLogin;
