import { GraphQLFieldResolver } from 'graphql';
import { isAdminResolver, MutationNotAllowedError } from '../../../apollo';
import db from '../../../db';
import { HarvestMode } from '../../../ww-commons';
import { GaugeRaw } from '../../gauges';
import { SourceRaw } from '../types';

interface RemoveVariables {
  id: string;
}

const resolver: GraphQLFieldResolver<any, any> = async (root, { id }: RemoveVariables) => {
  const source: Partial<SourceRaw> = await db().table('sources')
    .select(['harvest_mode', 'enabled']).where({ id }).first();
  if (source.harvest_mode === HarvestMode.ALL_AT_ONCE) {
    throw new MutationNotAllowedError({ message: 'Cannot generate schedule for all-at-once sources' });
  }
  if (source.enabled) {
    throw new MutationNotAllowedError({ message: 'Disable source first' });
  }
  const gauges: Array<Partial<GaugeRaw>> = await db().table('gauges').select(['id', 'cron']).where({ source_id: id });
  if (gauges.length === 0) {
    throw new MutationNotAllowedError({ message: 'Add gauges first' });
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

const generateSourceSchedule = isAdminResolver.createResolver(
  resolver,
);

export default generateSourceSchedule;
