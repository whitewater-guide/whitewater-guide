import log from '../../log';
import { GaugeRaw } from '../gauges';
import { insertMeasurements } from '../measurements';
import { execScript, ScriptCommand, ScriptMeasurement } from '../scripts';
import { SourceRaw } from '../sources';

const logger = log.child({ module: 'jobs' });

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
      logger.error({ msg: 'Harvest failed', error, source, gauge });
    }
  } catch (err) {
    logger.error({ msg: 'Failed to run worker', error: err.message, source, gauge });
  }
};
