import { readdir as readdirCb } from 'fs';
import { promisify } from 'util';
import { isAdminResolver } from '../../../apollo';
import { describeScript } from './describeScript';

const readDir = promisify(readdirCb);

const scripts = isAdminResolver.createResolver(
  async () => {
    const workers = await readDir(process.env.BACK_WORKERS_PATH!);
    return Promise.all(workers.map(script => describeScript(script)));
  },
);

export default scripts;
