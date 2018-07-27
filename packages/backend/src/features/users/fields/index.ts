import { FieldResolvers } from '@apollo';
import { timestampResolvers } from '@db';
import { User } from '@ww-commons';
import { UserRaw } from '../types';

const resolvers: FieldResolvers<UserRaw, User> = {
  editorSettings: u => u.editor_settings,
  purchasedRegions: (root, args, context) => context.purchasesLoader.loadPurchasedSingleRegions(),
  purchasedGroups: (root, args, context) => context.purchasesLoader.loadPurchasedGroups(),
  ...timestampResolvers,
};

export default resolvers;
