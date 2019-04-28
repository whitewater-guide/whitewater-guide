import db from '@db';
import { GaugeRaw } from '@features/gauges';
import { SourceRaw } from '@features/sources';
import { HarvestMode } from '@whitewater-guide/commons';
import { createJob } from './createJob';
import logger from './logger';
import safeScheduleJob from './safeScheduleJob';

export async function startJobs(sourceId: string, gaugeId?: string) {
  const source: SourceRaw = await db()
    .table('sources')
    .select([
      'id',
      'script',
      'cron',
      'enabled',
      'harvest_mode',
      'request_params',
    ])
    .where({ id: sourceId })
    .limit(1)
    .first();
  if (!source.enabled) {
    return;
  }
  if (source.harvest_mode === HarvestMode.ALL_AT_ONCE) {
    if (gaugeId) {
      logger.warn({
        message: `Attempt to start job for allAtOnce source '${sourceId}' with gauge '${gaugeId}'`,
      });
      return;
    }
    if (!source.cron) {
      logger.warn({
        message: `Attempt to start job for allAtOnce source '${sourceId}' without cron specified`,
      });
      return;
    }
    safeScheduleJob(source.id, source.cron, createJob(source));
  } else {
    let query = db()
      .table('gauges')
      .select(['id', 'code', 'cron', 'request_params'])
      .where({ enabled: true, source_id: sourceId })
      .whereNotNull('cron');
    if (gaugeId) {
      query = query.where({ id: gaugeId });
    }
    const gauges: GaugeRaw[] = await query;
    gauges.forEach((gauge) => {
      safeScheduleJob(
        `${source.id}:${gauge.id}`,
        gauge.cron!,
        createJob(source, gauge),
      );
    });
  }
}
