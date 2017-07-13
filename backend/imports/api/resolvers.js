import {sourcesResolvers} from './sources';
import {regionsResolvers} from './regions';
import {riversResolvers} from './rivers';
import {sectionsResolvers} from './sections';
import {userResolvers} from './users';
import {gaugesResolvers} from './gauges';
import {scriptsResolvers} from './scripts';
import {tagsResolvers} from './tags';
import {meteorResolver, adminResolver} from '../utils/ApolloUtils';
import GraphQLJSON from 'graphql-type-json';
import GraphQLDate from 'graphql-date';
import _ from 'lodash';

let resolvers = _.merge(
  userResolvers,
  sourcesResolvers,
  regionsResolvers,
  riversResolvers,
  sectionsResolvers,
  gaugesResolvers,
  tagsResolvers,
  scriptsResolvers,
);

resolvers.Mutation = _.mapValues(resolvers.Mutation, adminResolver);


//Decorate resolvers to make them more meteor-friendly
resolvers = _.mapValues(resolvers, graphqlType => _.mapValues(graphqlType, meteorResolver));
resolvers = _.merge(
  resolvers,
  {
    "JSON": GraphQLJSON,
    "Date": GraphQLDate,
    "UploadedFile": GraphQLJSON,
  },
);

export {
  resolvers
};

