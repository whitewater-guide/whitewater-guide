import { readdir as readdirCb } from 'fs';
import { promisify } from 'util';
import { isAdminResolver } from '../../../apollo';
import { describeWorker } from './describeWorker';

const readDir = promisify(readdirCb);

const scripts = isAdminResolver.createResolver(
  // () => [
  //   { id: 'galicia', name: 'galicia', harvestMode: HarvestMode.ALL_AT_ONCE, error: null },
  //   { id: 'norway', name: 'norway', harvestMode: HarvestMode.ONE_BY_ONE, error: null },
  // ],
  async () => {
    const workers = await readDir(process.env.BACK_WORKERS_PATH!);
    return Promise.all(workers.map(script => describeWorker(script)));
  },
);

export default scripts;
