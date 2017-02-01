import {HarvestMode, Source, sourceQueries} from '../api/sources/server/schema';
import {Region, Bounds, regionQueries, regionMutations} from '../api/regions/server/schema';
import {Point} from '../api/points/server/schema';

const Query = `
  type Query {
    ${sourceQueries}
    ${regionQueries}
  }
`;

const Mutation = `
  type Mutation {
    ${regionMutations}
  }
`;

const SchemaDefinition = `
  schema {
    query: Query,
    mutation: Mutation,
  }
`;


export const typeDefs = [
  Query,
  Mutation,
  Point,
  SchemaDefinition,
  HarvestMode, Source,
  Region, Bounds,
];
