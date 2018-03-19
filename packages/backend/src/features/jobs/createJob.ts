import { GaugeRaw } from '../gauges';
import { execScript, ScriptCommand } from '../scripts';
import { SourceRaw } from '../sources';
import logger from './logger';

export const createJob = (source: SourceRaw, gauge?: GaugeRaw) => async () => {
  try {
    const { data, success, error } = await execScript<number>({
      command: ScriptCommand.HARVEST,
      script: source.script,
      code: gauge ? gauge.code : '',
      extras: gauge ? gauge.request_params : {},
    });
    if (success) {
      if (data === 0) {
        logger.warn({
          msg: 'Harvest returned 0 measurements',
          error,
          source: source.id,
          script: source.script,
          gauge: gauge && gauge.code,
        });
      }
    } else {
      logger.error({
        msg: 'Harvest failed',
        error,
        source: source.id,
        script: source.script,
        gauge: gauge && gauge.code,
      });
    }
  } catch (err) {
    logger.error({
      msg: 'Failed to run worker',
      error: err.message,
      source: source.id,
      script: source.script,
      gauge: gauge && gauge.code,
    });
  }
};
