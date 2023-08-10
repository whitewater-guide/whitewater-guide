import { SocialMediaAccount } from '@whitewater-guide/schema';

import { Context, UserResolvers } from '~/apollo';

import { ResolvableUser } from '../types';

const accounts: UserResolvers<Context, ResolvableUser>['accounts'] = (u) => {
  const accounts: SocialMediaAccount[] = u.accounts || [];
  // This is not necessary social media account, and more like login method
  // It will return "local" for email+password auth
  // It's not renamed for backward compatibility reason
  if (u.has_password) {
    accounts.push({ id: u.id, provider: 'local' });
  }
  return accounts;
};

export default accounts;
