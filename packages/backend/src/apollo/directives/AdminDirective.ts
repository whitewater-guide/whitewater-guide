import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
} from 'apollo-server-koa';
import {
  defaultFieldResolver,
  GraphQLField,
  GraphQLFieldResolver,
  GraphQLInterfaceType,
  GraphQLObjectType,
} from 'graphql';
import { SchemaDirectiveVisitor } from 'graphql-tools';

import { Context } from '../context';

type Fields = GraphQLField<any, Context>;
interface Details {
  objectType: GraphQLObjectType | GraphQLInterfaceType;
}

export class AdminDirective extends SchemaDirectiveVisitor<any, any> {
  visitFieldDefinition(field: Fields, { objectType }: Details) {
    // Throw errors for queries and mutations
    if (objectType.name === 'Mutation' || objectType.name === 'Query') {
      const { resolve: oldResolver = defaultFieldResolver } = field;
      const newResolver: GraphQLFieldResolver<any, Context, any> = async (
        source,
        args,
        context,
        info,
      ) => {
        const error = this.checkPermissions(context);
        if (error) {
          throw error;
        }
        return oldResolver(source, args, context, info);
      };
      field.resolve = newResolver;
    } else {
      // Return null for fields
      const { resolve: oldResolver = defaultFieldResolver } = field;
      const newResolver: GraphQLFieldResolver<any, Context, any> = async (
        source,
        args,
        context,
        info,
      ) => {
        const error = this.checkPermissions(context);
        return error ? null : oldResolver(source, args, context, info);
      };
      field.resolve = newResolver;
    }
  }

  private checkPermissions(context: Context): ApolloError | null {
    if (!context.user) {
      return new AuthenticationError('must authenticate');
    }
    if (!context.user.admin) {
      return new ForbiddenError('must be admin');
    }
    return null;
  }
}
