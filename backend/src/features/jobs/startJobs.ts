import db from '../../db';
import { isMaster } from '../../utils';
import { HarvestMode } from '../../ww-commons';
import { GaugeRaw } from '../gauges';
import { SourceRaw } from '../sources';
import { createJob } from './createJob';
import safeScheduleJob from './safeScheduleJob';

export async function startJobs(sourceId: string, gaugeId?: string) {
  if (!isMaster()) {
    return;
  }
  const source: SourceRaw = await db().table('sources')
    .select(['id', 'script', 'cron', 'enabled', 'harvest_mode'])
    .where({ id: sourceId })
    .limit(1).first();
  if (!source.enabled) {
    return;
  }
  if (source.harvest_mode === HarvestMode.ALL_AT_ONCE) {
    if (gaugeId) {
      console.log('Attempt to start job for allAtOnce source with gauge');
      return;
    }
    if (!source.cron) {
      console.log('Attempt to start job for allAtOnce source without cron specified');
      return;
    }
    safeScheduleJob(source.id, source.cron, createJob(source));
  } else {
    let query = db().table('gauges')
      .select(['id', 'code', 'cron', 'request_params'])
      .where({ enabled: true, source_id: sourceId })
      .whereNotNull('cron');
    if (gaugeId) {
      query = query.where({ id: gaugeId });
    }
    const gauges: GaugeRaw[] = await query;
    gauges.forEach((gauge) => {
      safeScheduleJob(`${source.id}:${gauge.id}`, gauge.cron!, createJob(source, gauge));
    });
  }
}
