import { GraphQLFieldResolver } from 'graphql';
import { isAdminResolver, isInputValidResolver } from '../../../apollo';
import db from '../../../db';
import { SourceInput, SourceInputSchema } from '../../../ww-commons';
import { inputToRaw } from '../types';

interface UpsertVariables {
  source: SourceInput;
}

const resolver: GraphQLFieldResolver<any, any> = async (root, source: SourceInput) => {
  const raw = inputToRaw(source);
  const { id, ...rest } = raw;
  let data = null;
  if (id) {
    data = await db().table('sources').where({ id }).update(rest).returning('*');
  } else {
    data = await db().table('sources').insert(raw).returning('*');
  }
  return data[0];
};

const queryResolver: GraphQLFieldResolver<any, any> = (root, args: UpsertVariables, context, info) => {
  const { source } = args;
  return isInputValidResolver(SourceInputSchema).createResolver(resolver)(root, source, context, info);
};

const upsertSource = isAdminResolver.createResolver(
  queryResolver,
);

export default upsertSource;
