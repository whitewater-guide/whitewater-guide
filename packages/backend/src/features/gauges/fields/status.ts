import { Context } from '@apollo';
import { getLastStatus } from '@redis';
import { HarvestMode } from '@ww-commons';
import { GraphQLFieldResolver } from 'graphql';
import { GaugeRaw } from '../types';

const statusResolver: GraphQLFieldResolver<GaugeRaw, Context> = async ({ source_id, code }, _, { models }) => {
  const source = await models.sources.getById(source_id);
  if (!source) {
    return null;
  }
  if (source.harvest_mode === HarvestMode.ALL_AT_ONCE) {
    return null;
  }
  return getLastStatus(source.script, code);
};

export default statusResolver;
