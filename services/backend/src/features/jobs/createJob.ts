import { GaugeRaw } from '@features/gauges';
import { execScript, ScriptCommand } from '@features/scripts';
import { SourceRaw } from '@features/sources';
import logger from './logger';

export const createJob = (
  { script }: SourceRaw,
  gauge?: GaugeRaw,
) => async () => {
  try {
    const { data, success, error } = await execScript<number>({
      command: ScriptCommand.HARVEST,
      script,
      code: gauge ? gauge.code : '',
      extras: gauge ? gauge.request_params : {},
    });
    if (success) {
      if (data === 0) {
        logger.warn({
          msg: 'Harvest returned 0 measurements',
          error,
          script,
          gauge: gauge && gauge.code,
        });
      }
    } else {
      logger.error({
        msg: 'Harvest failed',
        error,
        script,
        gauge: gauge && gauge.code,
      });
    }
  } catch (err) {
    logger.error({
      msg: 'Failed to run worker',
      error: err.message,
      script,
      gauge: gauge && gauge.code,
    });
  }
};
