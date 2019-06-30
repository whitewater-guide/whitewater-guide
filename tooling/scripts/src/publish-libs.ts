import simpleGit from 'simple-git/promise';
import {
  bumpPackage,
  hasPackageChanged,
  installRecursive,
  npmPublish,
} from './utils';

const publishLibs = async () => {
  const git = simpleGit();
  const status = await git.status();
  if (!status.isClean()) {
    throw new Error('working tree is dirty');
  }

  const commonsChanged = await hasPackageChanged(
    'packages/commons',
    'published',
  );
  let clientsChanged = commonsChanged;
  if (!clientsChanged) {
    clientsChanged = await hasPackageChanged('packages/clients', 'published');
  }

  let commonsVersion: string;
  let libsVersions: string[] = [];
  if (commonsChanged) {
    commonsVersion = await bumpPackage('packages/commons');
    libsVersions = [commonsVersion];
    await npmPublish('packages/commons');
    await installRecursive([commonsVersion], ['packages/clients']);
  }
  if (clientsChanged) {
    const clientsVersion = await bumpPackage('packages/clients');
    libsVersions = [...libsVersions, clientsVersion];
    await npmPublish('packages/clients');
  }

  await installRecursive(libsVersions, ['packages/mobile', 'services/*']);
};

publishLibs().catch((e) => {
  // tslint:disable-next-line:no-console
  console.error(e);
  process.exit(1);
});
