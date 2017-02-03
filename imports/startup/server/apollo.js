import {createApolloServer} from 'meteor/apollo';
import {makeExecutableSchema} from 'graphql-tools';
import {loadSchema, getSchema} from 'graphql-loader'
import {initAccounts} from 'meteor/nicolaslopezj:apollo-accounts'

import {typeDefs} from '/imports/api/schema';
import {resolvers} from '/imports/api/resolvers';
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
  allowUndefinedInResolve: false,
});


createApolloServer(
  {
    schema: executableSchema,
  },
  {
    configServer: expressServer => expressServer.use(cors()),
  }
);

