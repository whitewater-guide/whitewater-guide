import { GraphQLFieldResolver } from 'graphql';
import { isAdminResolver } from '../../../apollo';
import db from '../../../db';

interface ToggleAllGaugesVariables {
  sourceId: string;
  enabled: boolean;
}

export const toggleAllGaugesQuery = ({ sourceId, enabled }: ToggleAllGaugesVariables) =>
  db().table('gauges').update({ enabled }).where({ source_id: sourceId, enabled: !enabled }).returning(['id', 'enabled']);

const resolver: GraphQLFieldResolver<any, any> = async (root, args: ToggleAllGaugesVariables) => {
  const toggledGauges = await toggleAllGaugesQuery(args);
  // TODO: return context language
  return toggledGauges.map((gauge: any) => ({ ...gauge, language: 'en' }));
};

const toggleAllGauges = isAdminResolver.createResolver(
  resolver,
);

export default toggleAllGauges;
