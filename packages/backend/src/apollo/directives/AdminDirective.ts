import { ApolloError } from 'apollo-errors';
import {
  defaultFieldResolver,
  GraphQLField,
  GraphQLFieldResolver,
  GraphQLInterfaceType,
  GraphQLObjectType,
} from 'graphql';
import { SchemaDirectiveVisitor } from 'graphql-tools';
import { Context, ContextUser } from '../context';
import { AuthenticationRequiredError, ForbiddenError } from '../errors';

type Fields = GraphQLField<any, Context>;
interface Details {
  objectType: GraphQLObjectType | GraphQLInterfaceType;
}

export class AdminDirective extends SchemaDirectiveVisitor {
  public visitFieldDefinition(field: Fields, { objectType }: Details) {
    // Throw errors for queries and mutations
    if (objectType.name === 'Mutation' || objectType.name === 'Query') {
      const { resolve: oldResolver = defaultFieldResolver } = field;
      const newResolver: GraphQLFieldResolver<any, Context, any> = async (source, args, context, info) => {
        const error = this.checkPermissions(source, context.user);
        if (error) {
          throw error;
        }
        return oldResolver(source, args, context, info);
      };
      field.resolve = newResolver;
    } else { // Return null for fields
      const { resolve: oldResolver = defaultFieldResolver } = field;
      const newResolver: GraphQLFieldResolver<any, Context, any> = async (source, args, context, info) => {
        const error = this.checkPermissions(source, context.user);
        return error ? null : oldResolver(source, args, context, info);
      };
      field.resolve = newResolver;
    }
  }

  private checkPermissions(source: any, user?: ContextUser): ApolloError | null  {
    if (!user) {
      return new AuthenticationRequiredError();
    }
    if (!user.admin) {
      return new ForbiddenError();
    }
    return null;
  }
}
