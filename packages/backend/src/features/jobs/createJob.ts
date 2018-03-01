import log from '../../log';
import { GaugeRaw } from '../gauges';
import { insertMeasurements } from '../measurements';
import { execScript, ScriptMeasurement, ScriptOperation, ScriptResponse } from '../scripts';
import { SourceRaw } from '../sources';

const logger = log.child({ module: 'jobs' });

export const getWorkerArgs = (gauge?: Partial<GaugeRaw>) => {
  // TODO: since!
  let opts: string[] = [];
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
  try {
    const response: ScriptResponse<ScriptMeasurement> = await execScript(
      source.script,
      ScriptOperation.HARVEST,
      getWorkerArgs(gauge),
    );
    if (response.success) {
      await insertMeasurements(response.data || []);
    } else {
      logger.error({ msg: 'Harvest failed', error: response.error, source, gauge });
    }
  } catch (err) {
    logger.error({ msg: 'Failed to run worker', error: err.message, source, gauge });
  }
};
