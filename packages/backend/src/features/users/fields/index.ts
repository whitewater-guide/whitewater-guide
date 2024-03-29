import type { UserResolvers } from '../../../apollo/index';
import { timestampedResolvers } from '../../../apollo/index';
import accounts from './accounts';
import avatar from './avatar';

const resolvers: UserResolvers = {
  editorSettings: (u) => u.editor_settings,
  purchasedRegions: (root, args, { dataSources }) =>
    dataSources.purchases.getPurchasedSingleRegions(),
  purchasedGroups: (root, args, { dataSources }) =>
    dataSources.purchases.getPurchasedGroups(),
  accounts,
  avatar,
  ...timestampedResolvers,
};

export default resolvers;
