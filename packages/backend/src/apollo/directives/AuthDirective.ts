import { ApolloError } from 'apollo-errors';
import {
  defaultFieldResolver,
  GraphQLField,
  GraphQLFieldResolver,
  GraphQLInterfaceType,
  GraphQLObjectType,
} from 'graphql';
import { SchemaDirectiveVisitor } from 'graphql-tools';
import { Role } from '../../ww-commons';
import { Context, ContextUser } from '../context';
import { AuthenticationRequiredError, ForbiddenError } from '../errors';

type Fields = GraphQLField<any, Context>;
interface Details {
  objectType: GraphQLObjectType | GraphQLInterfaceType;
}

export class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: Fields, { objectType }: Details) {
    const requiredRole = this.args.requires;
    if (objectType.name === 'Mutation' || objectType.name === 'Query') {
      const { resolve: oldResolver = defaultFieldResolver } = field;
      const newResolver: GraphQLFieldResolver<any, Context, any> = async (source, args, context, info) => {
        const error = this.checkPermissions(source, requiredRole, context.user);
        if (error) {
          throw error;
        }
        return oldResolver(source, args, context, info);
      };
      field.resolve = newResolver;
    } else {
      const { resolve: oldResolver = defaultFieldResolver } = field;
      const newResolver: GraphQLFieldResolver<any, Context, any> = async (source, args, context, info) => {
        const error = this.checkPermissions(source, requiredRole, context.user);
        return error ? null : oldResolver(source, args, context, info);
      };
      field.resolve = newResolver;
    }
  }

  checkPermissions(source: any, requiredRole: Role, user?: ContextUser): ApolloError | null  {
    if (!user) {
      return new AuthenticationRequiredError();
    }
    if (requiredRole === 'ADMIN' && user.admin) {
      return new ForbiddenError();
    }
    return null;
  }
}
