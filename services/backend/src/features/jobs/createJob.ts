import { GaugeRaw } from '@features/gauges';
import { execScript, ScriptCommand } from '@features/scripts';
import { SourceRaw } from '@features/sources';
import logger from './logger';

export const createJob = (
  { script, request_params }: SourceRaw,
  gauge?: GaugeRaw,
) => async () => {
  try {
    const reqParams = request_params || {};
    const gaugeReqParams = gauge ? gauge.request_params : {};
    const extras = { ...reqParams, ...gaugeReqParams };
    const { data, success, error } = await execScript<number>({
      command: ScriptCommand.HARVEST,
      script,
      code: gauge ? gauge.code : '',
      extras,
    });
    if (success) {
      if (data === 0) {
        logger.warn({
          message: 'Harvest returned 0 measurements',
          tags: { script, gauge: gauge && gauge.code },
          extra: { error },
        });
      }
    } else {
      logger.error({
        message: 'Harvest failed',
        tags: { script, gauge: gauge && gauge.code },
        extra: { error },
      });
    }
  } catch (err) {
    logger.error({
      message: 'Failed to run worker',
      tags: { script, gauge: gauge && gauge.code },
      extra: { error: err },
    });
  }
};
