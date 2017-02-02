import {HarvestMode, Source, sourceQueries} from '../api/sources/server/schema';
import Regions from '../api/regions/server/Regions.graphql';
import User from '../api/users/server/User.graphql';
import Points from '../api/points/server/Points.graphql';

const Query = `
  type Query {
    ${sourceQueries}
  }
`;

const SchemaDefinition = `
  schema {
    query: Query,
    mutation: Mutation,
  }
`;


export const typeDefs = [
  SchemaDefinition,
  Query,
  User,
  Regions,
  Points,
  HarvestMode, Source,
];
