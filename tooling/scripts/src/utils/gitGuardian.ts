import simpleGit from 'simple-git/promise';
import { EnvType } from '../types';

/**
 * Throws when git tree is dirty or environment doesn't match git branch
 * @param env
 */
export const gitGuardian = async (env: EnvType) => {
  if (env === EnvType.DEVELOPMENT) {
    return;
  }
  const git = simpleGit();
  const status = await git.status();
  if (!status.isClean()) {
    throw new Error('working tree is dirty');
  }
  const { current } = await git.branchLocal();
  if (env === EnvType.STAGING && current !== 'dev') {
    throw new Error('staging environment must be deployed from dev branch');
  }
  if (env === EnvType.PRODUCTION && current !== 'master') {
    throw new Error(
      'production environment must be deployed from master branch',
    );
  }
};
