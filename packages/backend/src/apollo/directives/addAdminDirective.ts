import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import type {
  GraphQLError,
  GraphQLFieldResolver,
  GraphQLSchema,
} from 'graphql';
import { defaultFieldResolver } from 'graphql';

import type { Context } from '../context';
import { AuthenticationError, ForbiddenError } from '../errors';

function checkPermissions(context: Context): GraphQLError | null {
  if (!context.user) {
    return new AuthenticationError('must authenticate');
  }
  if (!context.user.admin) {
    return new ForbiddenError('must be admin');
  }
  return null;
}

export function addAdminDirective(schema: GraphQLSchema) {
  return mapSchema(schema, {
    [MapperKind.MUTATION_ROOT_FIELD]: (fieldConfig) => {
      const directive = getDirective(schema, fieldConfig, 'admin')?.[0];
      if (directive) {
        const { resolve: oldResolve = defaultFieldResolver } = fieldConfig;

        const newResolve: GraphQLFieldResolver<any, Context, any> = async (
          source,
          args,
          context,
          info,
        ) => {
          const error = checkPermissions(context);
          // For mutations we throw error
          if (error) {
            throw error;
          }
          return oldResolve(source, args, context, info);
        };
        fieldConfig.resolve = newResolve;

        return fieldConfig;
      }
    },
    [MapperKind.OBJECT_FIELD]: (fieldConfig, fieldName, typeName) => {
      const directive = getDirective(schema, fieldConfig, 'admin')?.[0];

      if (directive) {
        const { resolve: oldResolve = defaultFieldResolver } = fieldConfig;

        const newResolve: GraphQLFieldResolver<any, Context, any> = async (
          source,
          args,
          context,
          info,
        ) => {
          const error = checkPermissions(context);
          // For root queries we throw error
          if (error && typeName === 'Query') {
            throw error;
          }
          // For type fields, we return null instead of actual value
          return error ? null : oldResolve(source, args, context, info);
        };
        fieldConfig.resolve = newResolve;

        return fieldConfig;
      }
    },
  });
}
