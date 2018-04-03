import { GraphQLFieldResolver } from 'graphql';
import { baseResolver, MutationNotAllowedError } from '../../../apollo';
import db from '../../../db';

interface Vars {
  id: string;
}

const resolver: GraphQLFieldResolver<any, any, Vars> = async (root, { id }) => {
  const [{ count }] = await db().table('rivers').count('*').where({ region_id: id });
  if (Number(count) !== 0) {
    throw new MutationNotAllowedError({ message: 'Delete the rivers first' });
  }
  return db().table('regions').del().where({ id }).returning('id');
};

const removeRegion = baseResolver.createResolver(
  resolver,
);

export default removeRegion;
