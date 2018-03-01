import { execFile as execFileCb } from 'child_process';
import { resolve } from 'path';
import { promisify } from 'util';
import { HarvestMode } from '../../../ww-commons';

const execFile = promisify(execFileCb);

export const describeWorker = async (script: string) => {
  const result = {
    id: script,
    name: script,
    harvestMode: HarvestMode.ALL_AT_ONCE,
    error: null,
  };
  try {
    const { stdout } = await execFile(resolve(process.env.BACK_WORKERS_PATH!, script), ['describe']);
    const raw: { [key: string]: any } = JSON.parse(stdout);
    result.id = raw.name;
    result.name = raw.name;
    result.harvestMode = raw.mode;
  } catch (err) {
    result.error = err.message;
  }
  return result;
};
