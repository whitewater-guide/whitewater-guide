import { execFile as execFileCb } from 'child_process';
import { resolve } from 'path';
import { promisify } from 'util';
import { GaugeRaw } from '../gauges';
import { insertMeasurements } from '../measurements';
import { SourceRaw } from '../sources';
import { WorkerResponse } from './types';

const execFile = promisify(execFileCb);

export const getWorkerArgs = (gauge?: Partial<GaugeRaw>) => {
  // TODO: since!
  let opts = ['harvest'];
  if (gauge) {
    opts = [...opts, '--code', gauge.code!];
    if (gauge.request_params) {
      Object.entries(gauge.request_params).forEach(([k, v]: [string, string]) => {
        opts = [...opts, `--${k}`, v.toString()];
      });
    }
  }
  return opts;
};

export const createJob = (source: SourceRaw, gauge?: GaugeRaw) => async () => {
  const workerArgs = getWorkerArgs(gauge);
  try {
    const { stdout } = await execFile(resolve(process.env.BACK_WORKERS_PATH!, source.script), workerArgs);
    const response: WorkerResponse = JSON.parse(stdout);
    if (response.success) {
      await insertMeasurements(response.data);
    } else {
      console.log('Worker error:', response.error);
    }
  } catch (err) {
    console.log('Failed to run worker', err);
  }
};
