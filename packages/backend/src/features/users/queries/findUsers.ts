import { GraphQLFieldResolver } from 'graphql';
import { baseResolver, Context } from '../../../apollo';
import db from '../../../db';

interface Vars {
  search: string;
}

const resolver: GraphQLFieldResolver<any, Context> = (root, { search }: Vars) =>
  db().table('users')
    .where('name', 'ilike', `%${search}%`)
    .orWhere('email', 'ilike', `%${search}%`)
    .orderBy('name')
    .limit(10);

const findUsers = baseResolver.createResolver(resolver);

export default findUsers;
