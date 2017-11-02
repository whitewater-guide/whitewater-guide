import { GaugesSchema } from '../features/gauges';
import { PointsSchema } from '../features/points';
import { RegionsSchema } from '../features/regions';
import { RiversSchema } from '../features/rivers';
import { ScriptsSchema } from '../features/scripts/index';
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
  
  input Page {
    limit: Int
    offset: Int
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
  RiversSchema,
  RegionsSchema,
  SourcesSchema,
  UsersSchema,
  PointsSchema,
  ScriptsSchema,
];
