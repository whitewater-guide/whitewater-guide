import { spawnSync } from 'child_process';
import simpleGit from 'simple-git/promise';

const preCommitHook = async () => {
  const git = simpleGit();
  // Encrypt all secrets (only if they change = -m)
  await git.raw(['secret', 'hide', '-m']);
  // List all secrets
  const rawSecrets = await git.raw(['secret', 'list']);
  // Add secrets dir
  const secrets = rawSecrets
    .split('\n')
    .filter((s) => !!s)
    .map((s) => `${s}.secret`)
    .concat('.gitsecret');
  await git.add(secrets);
  await spawnSync('yarn', ['pretty-quick', '--staged'], { stdio: 'inherit' });
};

preCommitHook().catch(() => process.exit(1));
