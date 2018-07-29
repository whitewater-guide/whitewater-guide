import { Context } from '@apollo';
import { GraphQLFieldResolver } from 'graphql';
import { RegionRaw } from '../types';

const editableResolver: GraphQLFieldResolver<RegionRaw, Context> = async ({ id, editable }, _, { user, models }) => {
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
    await models.regions.assertEditorPermissions(id);
  } catch {
    return false;
  }
  return true;
};

export default editableResolver;
