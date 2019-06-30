import simpleGit from 'simple-git/promise';
import {
  bumpPackage,
  hasPackageChanged,
  installRecursive,
  npmPublish,
  updateMeta,
} from './utils';
import { Package } from './utils/types';

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

  let commons: Package;
  let libs: Package[] = [];
  if (commonsChanged) {
    commons = await bumpPackage('packages/commons');
    libs = [commons];
    await npmPublish('packages/commons');
    await installRecursive([commons], ['packages/clients']);
  }
  if (clientsChanged) {
    const clientsVersion = await bumpPackage('packages/clients');
    libs = [...libs, clientsVersion];
    await npmPublish('packages/clients');
  }

  await installRecursive(libs, ['packages/mobile', 'services/*']);

  await git.commit('chore: publish' + libs.join(', '), undefined, {
    '--no-verify': null,
  });

  if (commonsChanged) {
    await updateMeta('packages/commons', 'published');
  }
  if (clientsChanged) {
    await updateMeta('packages/clients', 'published');
  }
};

publishLibs().catch((e) => {
  // tslint:disable-next-line:no-console
  console.error(e);
  process.exit(1);
});
