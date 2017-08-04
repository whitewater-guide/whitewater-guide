import { GraphQLDateTime } from 'graphql-iso-date';
import * as GraphQLJSON from 'graphql-type-json';
import { merge } from 'lodash';
import { gaugesResolvers } from '../features/gauges';
import { regionsResolvers } from '../features/regions';
import { sourcesResolvers } from '../features/sources';
import { usersResolvers } from '../features/users';

export const resolvers = merge(
  sourcesResolvers,
  gaugesResolvers,
  usersResolvers,
  regionsResolvers,
  {
    Date: GraphQLDateTime,
    JSON: GraphQLJSON,
    UploadedFile: GraphQLJSON,
  },
);
