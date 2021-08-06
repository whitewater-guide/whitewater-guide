import { Context, UserResolvers } from '~/apollo';

import { ResolvableUser } from '../types';

const accounts: UserResolvers<Context, ResolvableUser>['accounts'] = (u) =>
  u.accounts || [];

export default accounts;
