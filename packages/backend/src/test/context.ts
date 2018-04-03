import Koa from 'koa';
import { newContext } from '../apollo';
import { UserRaw } from '../features/users';

const FakeKoaContext: Partial<Koa.Context> = {
  acceptsLanguages: () => false,
  set: () => {},
};

export const fakeContext = (user?: UserRaw, language?: string) => {
  const context = newContext({
    state: { user },
    ...FakeKoaContext,
  });
  if (language) {
    context.language = language;
  }
  return context;
};

export const anonContext = (language?: string) => fakeContext(undefined, language);
