import { FieldResolvers } from '@apollo';
import { timestampResolvers } from '@db';
import { User } from '@whitewater-guide/commons';
import { UserRaw } from '../types';
import avatar from './avatar';

const resolvers: FieldResolvers<UserRaw, User> = {
  editorSettings: (u) => u.editor_settings,
  purchasedRegions: (root, args, { dataSources }) =>
    dataSources.purchases.getPurchasedSingleRegions(),
  purchasedGroups: (root, args, { dataSources }) =>
    dataSources.purchases.getPurchasedGroups(),
  accounts: (u) => u.accounts || [],
  avatar,
  ...timestampResolvers,
};

export default resolvers;
