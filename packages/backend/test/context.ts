import { Overwrite } from 'utility-types';

import { Context } from '~/apollo';
import { Sql } from '~/db';

type InsertedUser = Overwrite<Sql.Users, { tokens: string }>;

export const fakeContext = (
  user?: InsertedUser,
  language = 'en',
): Omit<Context, 'dataSources'> => {
  const fieldsByType = new Map<string, Set<string>>();
  // dataSources are not optional, but they're added later
  return { user, language, fieldsByType };
};

export const anonContext = (language = 'en') =>
  fakeContext(undefined, language);
