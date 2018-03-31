import { GraphQLFieldResolver } from 'graphql';
import { isAdminResolver, MutationNotAllowedError } from '../../../apollo';
import db from '../../../db';
import { HarvestMode } from '../../../ww-commons';
import { startJobs, stopJobs } from '../../jobs';
import { SourceRaw } from '../../sources';

interface ToggleAllGaugesVariables {
  sourceId: string;
  enabled: boolean;
}

const resolver: GraphQLFieldResolver<any, any> = async (root, { sourceId, enabled }: ToggleAllGaugesVariables) => {
  const { harvest_mode }: Partial<SourceRaw> = await db().table('sources')
    .select(['harvest_mode']).where({ id: sourceId }).first();
  if (harvest_mode === HarvestMode.ALL_AT_ONCE) {
    throw new MutationNotAllowedError({ message: 'Not allowed on all-at-once sources' });
  }
  let query = db().table('gauges')
    .update({ enabled })
    .where({ source_id: sourceId, enabled: !enabled })
    .returning(['id', 'enabled']);
  if (enabled) {
    query = query.whereNotNull('cron');
  }
  const toggledGauges = await query;

  // TODO: should be in transaction
  if (enabled) {
    await startJobs(sourceId);
  } else {
    await stopJobs(sourceId);
  }

  return toggledGauges.map((gauge: any) => ({ ...gauge }));
};

const toggleAllGauges = isAdminResolver.createResolver(
  resolver,
);

export default toggleAllGauges;
