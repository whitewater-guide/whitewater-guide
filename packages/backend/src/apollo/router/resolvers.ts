import { GraphQLDateTime } from 'graphql-iso-date';
import GraphQLJSON from 'graphql-type-json';
import { merge } from 'lodash';
import { gaugesResolvers } from '../../features/gauges';
import { measurementsResolvers } from '../../features/measurements';
import { mediaResolvers } from '../../features/media';
import { pointsResolvers } from '../../features/points';
import { regionsResolvers } from '../../features/regions';
import { riversResolvers } from '../../features/rivers';
import { scriptsResolvers } from '../../features/scripts';
import { sectionsResolvers } from '../../features/sections';
import { sourcesResolvers } from '../../features/sources';
import { tagsResolvers } from '../../features/tags';
import { usersResolvers } from '../../features/users';

export const resolvers = merge(
  gaugesResolvers,
  tagsResolvers,
  pointsResolvers,
  regionsResolvers,
  riversResolvers,
  scriptsResolvers,
  sectionsResolvers,
  sourcesResolvers,
  usersResolvers,
  mediaResolvers,
  measurementsResolvers,
  {
    Date: GraphQLDateTime,
    JSON: GraphQLJSON,
  },
);
