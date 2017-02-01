import {HarvestMode, Source, sourceQueries} from '../api/sources/server/schema';
import {Region, Bounds, regionQueries} from '../api/regions/server/schema';
import {Point} from '../api/points/server/schema';

const Query = `
  type Query {
    ${sourceQueries}
    ${regionQueries}
  }
`;

const SchemaDefinition = `
  schema {
    query: Query
  }
`;


export const typeDefs = [
  Query,
  Point,
  SchemaDefinition,
  HarvestMode, Source,
  Region, Bounds,
];
