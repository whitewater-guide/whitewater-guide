import { newContext } from '../apollo';
import { ADMIN, SUPERADMIN, TEST_USER } from '../seeds/test/01_users';

export const anonContext = (language?: string) => newContext({ language } as any);
export const userContext = (language?: string) => {
  const context = newContext({ user: TEST_USER } as any);
  if (language) {
    context.language = language;
  }
  return context;
};

export const adminContext = (language?: string) => {
  const context = newContext({ user: ADMIN } as any);
  if (language) {
    context.language = language;
  }
  return context;
};

export const superAdminContext = (language?: string) => {
  const context = newContext({ user: SUPERADMIN } as any);
  if (language) {
    context.language = language;
  }
  return context;
};
