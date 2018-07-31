import { MutationNotAllowedError, TopLevelResolver } from '@apollo';
import db from '@db';
import { GaugeRaw } from '@features/gauges';
import { HarvestMode } from '@ww-commons';
import { SourceRaw } from '../types';

interface Vars {
  id: string;
}

const generateSourceSchedule: TopLevelResolver<Vars> = async (root, { id }) => {
  const source: Partial<SourceRaw> = await db().table('sources')
    .select(['harvest_mode', 'enabled']).where({ id }).first();
  if (source.harvest_mode === HarvestMode.ALL_AT_ONCE) {
    throw new MutationNotAllowedError('Cannot generate schedule for all-at-once sources');
  }
  if (source.enabled) {
    throw new MutationNotAllowedError('Disable source first');
  }
  const gauges: Array<Partial<GaugeRaw>> = await db().table('gauges').select(['id', 'cron']).where({ source_id: id });
  if (gauges.length === 0) {
    throw new MutationNotAllowedError('Add gauges first');
  }
  const step = 59 / gauges.length;
  const values = gauges
    .map((g, i) => {
      const minute = Math.ceil(i * step);
      const cron = `${minute} * * * *`;
      return `('${g.id}' :: UUID, '${cron}')`;
    })
    .join(',');
  const result = await db().raw(`
    UPDATE gauges AS g SET cron = v.cron
    FROM (VALUES
      ${values}
    ) AS v(id, cron)
    WHERE g.id = v.id
    RETURNING g.id, g.cron
  `);
  return result.rows.map((g: GaugeRaw) => ({ ...g }));
};

export default generateSourceSchedule;
