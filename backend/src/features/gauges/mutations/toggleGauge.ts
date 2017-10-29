import { GraphQLFieldResolver } from 'graphql';
import { isAdminResolver } from '../../../apollo';
import db from '../../../db';

interface ToggleVariables {
  id: string;
  enabled: boolean;
}

export const toggleGaugeQuery = ({ id, enabled }: ToggleVariables) =>
  db().table('gauges').update({ enabled }).where({ id }).returning(['id', 'enabled']);

const resolver: GraphQLFieldResolver<any, any> = async (root, args: ToggleVariables) => {
  const [{ id, enabled }] = await toggleGaugeQuery(args);
  // TODO: return context langauge
  return { id, enabled, language: 'en' };
};

const toggleGauge = isAdminResolver.createResolver(
  resolver,
);

export default toggleGauge;
