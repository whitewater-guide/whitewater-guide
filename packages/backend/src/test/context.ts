import Koa from 'koa';
import { newContext } from '../apollo';
import { ADMIN, SUPERADMIN, TEST_USER } from '../seeds/test/01_users';

const FakeKoaContext: Partial<Koa.Context> = {
  acceptsLanguages: () => false,
  set: () => {},
};

export const anonContext = (language?: string) => {
  const context = newContext(FakeKoaContext);
  if (language) {
    context.language = language;
  }
  return context;
};

export const userContext = (language?: string) => {
  const context = newContext({
    state: { user: TEST_USER },
    ...FakeKoaContext,
  });
  if (language) {
    context.language = language;
  }
  return context;
};

export const adminContext = (language?: string) => {
  const context = newContext({
    state: { user: ADMIN },
    ...FakeKoaContext,
  });
  if (language) {
    context.language = language;
  }
  return context;
};

export const superAdminContext = (language?: string) => {
  const context = newContext({
    state: { user: SUPERADMIN },
    ...FakeKoaContext,
  });
  if (language) {
    context.language = language;
  }
  return context;
};
