import {createApolloServer} from 'meteor/apollo';
import {makeExecutableSchema, addSchemaLevelResolveFunction} from 'graphql-tools';
import {loadSchema, getSchema} from 'graphql-loader'
import {initAccounts} from 'meteor/nicolaslopezj:apollo-accounts'
import {Roles} from 'meteor/alanning:roles';
import {typeDefs} from '../api/schema';
import {resolvers} from '../api/resolvers';
import cors from 'cors';

// Load all accounts related resolvers and type definitions into graphql-loader
initAccounts({});

loadSchema({
  typeDefs,
  resolvers,
});

// Gets all the resolvers and type definitions loaded in graphql-loader
const schema = getSchema();
const executableSchema = makeExecutableSchema({
  ...schema,
  allowUndefinedInResolve: true,
});

addSchemaLevelResolveFunction(executableSchema, (root, args, context, info) => {
  context.isAdmin = Roles.userIsInRole(context.user, ['admin']);
  context.isSuperAdmin = Roles.userIsInRole(context.user, ['super-admin']);
  return root;
});

createApolloServer(
  {
    schema: executableSchema,
  },
  {
    configServer: expressServer => expressServer.use(cors()),
  }
);
