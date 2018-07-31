import { Context } from '@apollo';
import { GraphQLFieldResolver } from 'graphql';
import { RegionRaw } from '../types';

const editableResolver: GraphQLFieldResolver<RegionRaw, Context> = async ({ id, editable }, _, { user, dataSources }) => {
  if (!user) {
    return false;
  }
  if (user.admin) {
    return true;
  }
  if (typeof(editable) === 'boolean') {
    return editable;
  }
  try {
    await dataSources.regions.assertEditorPermissions(id);
  } catch {
    return false;
  }
  return true;
};

export default editableResolver;
