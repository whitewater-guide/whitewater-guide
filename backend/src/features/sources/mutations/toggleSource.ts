import { GraphQLFieldResolver } from 'graphql';
import { isAdminResolver } from '../../../apollo';
import db from '../../../db';

interface ToggleVariables {
  id: string;
  enabled: boolean;
}

export const toggleSourceQuery = ({ id, enabled }: ToggleVariables) =>
  db().table('sources').update({ enabled }).where({ id }).returning(['id', 'enabled']);

const resolver: GraphQLFieldResolver<any, any> = async (root, args: ToggleVariables) => {
  const [{ id, enabled }] = await toggleSourceQuery(args);
  // TODO: return context language
  return { id, enabled, language: 'en' };
};

const toggleSource = isAdminResolver.createResolver(
  resolver,
);

export default toggleSource;
