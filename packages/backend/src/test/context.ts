import { newContext } from '@apollo';
import { UserRaw } from '@features/users';
import Koa from 'koa';

const FakeKoaContext: Partial<Koa.Context> = {
  acceptsLanguages: () => false,
  set: () => {},
};

export const fakeContext = (user?: UserRaw, language?: string) => {
  const context = newContext(
    {
      headers: {},
      state: { user },
      ...FakeKoaContext,
    },
    language,
  );
  return context;
};

export const anonContext = (language?: string) => fakeContext(undefined, language);
