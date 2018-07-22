import { baseResolver, TopLevelResolver } from '../../../apollo';
import db from '../../../db';

interface Vars {
  search: string;
}

const resolver: TopLevelResolver<Vars> = (root, { search }) =>
  db().table('users')
    .where('name', 'ilike', `%${search}%`)
    .orWhere('email', 'ilike', `%${search}%`)
    .orderBy('name')
    .limit(10);

const findUsers = baseResolver.createResolver(resolver);

export default findUsers;
