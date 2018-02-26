import { GraphQLFieldResolver } from 'graphql';
import { isSuperadminResolver } from '../../../apollo/enhancedResolvers';
import { RemoveQuery } from '../../../apollo/types';
import db from '../../../db';

export const removeTagQuery = ({ id }: RemoveQuery) =>
  db().table('tags').del().where({ id }).returning('id');

const resolver: GraphQLFieldResolver<any, any> = async (root, args: RemoveQuery) => {
  const [result] = await removeTagQuery(args);
  return result;
};

const removeTag = isSuperadminResolver.createResolver(
  resolver,
);

export default removeTag;
