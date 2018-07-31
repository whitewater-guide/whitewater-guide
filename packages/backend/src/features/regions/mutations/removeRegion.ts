import { baseResolver, MutationNotAllowedError } from '@apollo';
import db from '@db';
import { GraphQLFieldResolver } from 'graphql';

interface Vars {
  id: string;
}

const resolver: GraphQLFieldResolver<any, any, Vars> = async (root, { id }) => {
  const [{ count }] = await db().table('rivers').count('*').where({ region_id: id });
  if (Number(count) !== 0) {
    throw new MutationNotAllowedError({ message: 'Delete the rivers first' });
  }
  const result = await db().table('regions').del().where({ id }).returning('id');
  return (result && result.length) ? result[0] : null;
};

const removeRegion = baseResolver.createResolver(
  resolver,
);

export default removeRegion;
