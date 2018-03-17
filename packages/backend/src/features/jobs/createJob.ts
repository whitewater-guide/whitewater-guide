import { GaugeRaw } from '../gauges';
import { insertMeasurements } from '../measurements';
import { execScript, ScriptCommand, ScriptMeasurement } from '../scripts';
import { SourceRaw } from '../sources';
import logger from './logger';

export const createJob = (source: SourceRaw, gauge?: GaugeRaw) => async () => {
  try {
    const { data, success, error } = await execScript<ScriptMeasurement>({
      command: ScriptCommand.HARVEST,
      script: source.script,
      code: gauge ? gauge.code : '',
      // since // TODO: since
      extras: gauge ? gauge.request_params : {},
    });
    if (success) {
      await insertMeasurements(data || []);
    } else {
      logger.error({
        msg: 'Harvest failed',
        error,
        source: source.id,
        script: source.script,
        gauge: gauge && gauge.id,
      });
    }
  } catch (err) {
    logger.error({
      msg: 'Failed to run worker',
      error: err.message,
      source: source.id,
      script: source.script,
      gauge: gauge && gauge.id,
    });
  }
};
