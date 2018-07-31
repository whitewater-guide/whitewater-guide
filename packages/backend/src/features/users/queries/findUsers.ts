import { TopLevelResolver } from '@apollo';
import db from '@db';

interface Vars {
  search: string;
}

const findUsers: TopLevelResolver<Vars> = (root, { search }) =>
  db().table('users')
    .where('name', 'ilike', `%${search}%`)
    .orWhere('email', 'ilike', `%${search}%`)
    .orderBy('name')
    .limit(10);

export default findUsers;
