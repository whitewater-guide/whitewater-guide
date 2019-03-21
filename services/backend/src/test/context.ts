import { Context } from '@apollo';
import { UserRawInput } from '@features/users';
import { Omit } from 'type-zoo';

export const fakeContext = (
  user?: UserRawInput,
  language = 'en',
): Omit<Context, 'dataSources'> => {
  const fieldsByType = new Map<string, Set<string>>();
  // dataSources are not optional, but they're added later
  return { user: user as any, language, fieldsByType };
};

export const anonContext = (language = 'en') =>
  fakeContext(undefined, language);
