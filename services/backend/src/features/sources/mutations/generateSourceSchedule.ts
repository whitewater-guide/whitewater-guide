import { MutationNotAllowedError, TopLevelResolver } from '@apollo';
import db from '@db';
import { GaugeRaw } from '@features/gauges';
import { HarvestMode } from '@whitewater-guide/commons';
import { SourceRaw } from '../types';

interface Vars {
  id: string;
  linkedOnly: boolean;
}

interface LinkedGauge {
  id: string;
  cron: string | null;
  linked: boolean;
}

const generateSourceSchedule: TopLevelResolver<Vars> = async (_, vars) => {
  const { id, linkedOnly } = vars;
  const source: Partial<SourceRaw> = await db()
    .table('sources')
    .select(['harvest_mode', 'enabled'])
    .where({ id })
    .first();
  if (source.harvest_mode === HarvestMode.ALL_AT_ONCE) {
    throw new MutationNotAllowedError(
      'Cannot generate schedule for all-at-once sources',
    );
  }
  if (source.enabled) {
    throw new MutationNotAllowedError('Disable source first');
  }
  const linkedSubquery = db()
    .select(db().raw('1'))
    .from('sections')
    .where('gauge_id', db().raw('??', ['gauges.id']))
    .limit(1);

  const gauges: LinkedGauge[] = await db()
    .table('gauges')
    .select([
      'id',
      'cron',
      db().raw('EXISTS (?) as ??', [linkedSubquery, 'linked']),
    ])
    .where({ source_id: id });
  if (gauges.length === 0) {
    throw new MutationNotAllowedError('Add gauges first');
  }
  const numLinkedGauges = gauges.filter((g) => !!g.linked).length;
  if (linkedOnly && numLinkedGauges === 0) {
    throw new MutationNotAllowedError('No linked gauges found');
  }
  const numGauges = linkedOnly ? numLinkedGauges : gauges.length;
  const step = 59 / numGauges;
  let i = 0;
  const values = gauges
    .map((g) => {
      const minute = Math.ceil(i * step);
      let cron = 'NULL';
      if (!linkedOnly || g.linked) {
        cron = `'${minute} * * * *'`;
        i += 1;
      }
      return `('${g.id}' :: UUID, ${cron})`;
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
