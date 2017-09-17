import { GaugesSchema } from '../features/gauges';
import { PointsSchema } from '../features/points';
import { RegionsSchema } from '../features/regions';
import { SourcesSchema } from '../features/sources';
import { UsersSchema } from '../features/users';

// tslint:disable:no-trailing-whitespace
const SchemaDefinition = `
  scalar JSON
  scalar Date
  scalar UploadedFile
  
  enum SortDirection {
    asc
    desc
  }
  
  input RefInput {
    id: ID!
    name: String
  }
  
  interface INamed {
    id: ID!
    name: String!
  }
  
  schema {
    query: Query
    mutation: Mutation
    # subscription: Subscription
  }
`;

export const typeDefs = [
  SchemaDefinition,
  GaugesSchema,
  RegionsSchema,
  SourcesSchema,
  UsersSchema,
  PointsSchema,
];
