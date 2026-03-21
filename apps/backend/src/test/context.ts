import type { Overwrite } from 'utility-types';

import { Context } from '../apollo/index';
import type { Sql } from '../db/index';

type InsertedUser = Overwrite<Sql.Users, { tokens: string }>;

export const fakeContext = (user?: InsertedUser, language = 'en'): Context => {
  return new Context(language, user);
};

export const anonContext = (language = 'en') =>
  fakeContext(undefined, language);
