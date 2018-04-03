import { GraphQLFieldResolver } from 'graphql';
import { baseResolver } from '../../../apollo';
import db from '../../../db';

interface Vars {
  id: string;
}

const resolver: GraphQLFieldResolver<any, any> = (root, { id }: Vars) =>
  db().table('sections').del().where({ id }).returning('id');

const removeSection = baseResolver.createResolver(
  resolver,
);

export default removeSection;
