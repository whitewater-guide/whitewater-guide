import {Meteor} from 'meteor/meteor';
import {createApolloServer} from 'meteor/apollo';
import {makeExecutableSchema} from 'graphql-tools';

import {typeDefs} from '/imports/api/schema';
import {resolvers} from '/imports/api/resolvers';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  allowUndefinedInResolve: Meteor.isProduction,
});

createApolloServer({
  schema,
});