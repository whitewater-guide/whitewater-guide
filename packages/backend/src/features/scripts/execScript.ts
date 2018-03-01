import { execFile as execFileCb } from 'child_process';
import { resolve } from 'path';
import { promisify } from 'util';
import { ScriptOperation } from './types';

const execFile = promisify(execFileCb);

export const execScript = async (script: string, operation: ScriptOperation, options: string[] = []) => {
  const { stdout } = await execFile(
    resolve(process.env.BACK_WORKERS_PATH!, script),
    [operation, ...options],
  );
  return JSON.parse(stdout);
};
