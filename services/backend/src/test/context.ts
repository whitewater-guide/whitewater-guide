import { Context } from '@apollo';
import { UserRaw } from '@features/users';
import { Omit } from 'type-zoo';

export const fakeContext = (
  user?: UserRaw,
  language = 'en',
): Omit<Context, 'dataSources'> => {
  const fieldsByType = new Map<string, Set<string>>();
  // dataSources are not optional, but they're added later
  return { user, language, fieldsByType };
};

export const anonContext = (language = 'en') =>
  fakeContext(undefined, language);
