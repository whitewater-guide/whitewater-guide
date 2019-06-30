import simpleGit from 'simple-git/promise';
import {
  bumpPackage,
  hasPackageChanged,
  installRecursive,
  npmPublish,
  updateMeta,
} from './utils';
import { Package } from './utils/types';

/**
 * Publishes @whitewater-guide/commons and @whitewater-guide/clients on npm
 * Then installs latest versions of these libs in all their consumers
 * Then commits everything and updates ww-meta.json files
 */
const publishLibs = async () => {
  const git = simpleGit();
  const status = await git.status();
  if (!status.isClean()) {
    throw new Error('working tree is dirty');
  }

  const commonsChanged = await hasPackageChanged('packages/commons');
  let clientsChanged = commonsChanged;
  if (!clientsChanged) {
    clientsChanged = await hasPackageChanged('packages/clients');
  }

  let libs: Package[] = [];
  if (commonsChanged) {
    const commons = await bumpPackage('packages/commons');
    libs = [commons!];
    await npmPublish('packages/commons');
    await installRecursive([commons!], ['packages/clients']);
  }
  if (clientsChanged) {
    const clients = await bumpPackage('packages/clients');
    libs = [...libs, clients!];
    await npmPublish('packages/clients');
  }

  await installRecursive(libs, ['packages/mobile', 'services/*']);

  await git.commit('chore: publish' + libs.join(', '), undefined, {
    '--no-verify': null,
  });

  if (commonsChanged) {
    await updateMeta('packages/commons');
  }
  if (clientsChanged) {
    await updateMeta('packages/clients');
  }
};

publishLibs().catch((e) => {
  // tslint:disable-next-line:no-console
  console.error(e);
  process.exit(1);
});
