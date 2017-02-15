import {SourcesGraphqlSchema} from './sources';
import {RegionsGraphqlSchema} from './regions';
import {RiversGraphqlSchema} from './rivers';
import {UserGraphqlSchema} from './users';
import {PointsGraphqlSchema} from './points';
import {GaugesGraphqlSchema} from './gauges';
import {MediaGraphqlSchema} from './media';
import {SectionsGraphqlSchema} from './sections';
import {JobsGraphqlSchema} from './jobs';
import {TagsGraphqlSchema} from './tags';
import {ScriptsGraphqlSchema} from './scripts';

const SchemaDefinition = `
  scalar JSON
  scalar Date
  
  enum SortDirection {
    asc
    desc
  }
  
  input RefInput {
    _id: ID!
    name: String
  }
  
  interface INamed {
    _id: ID!,
    name: String!
  }
  
  schema {
    query: Query,
    mutation: Mutation,
  }
`;

export const typeDefs = [
  SchemaDefinition,
  SourcesGraphqlSchema,
  RegionsGraphqlSchema,
  RiversGraphqlSchema,
  UserGraphqlSchema,
  PointsGraphqlSchema,
  GaugesGraphqlSchema,
  MediaGraphqlSchema,
  SectionsGraphqlSchema,
  JobsGraphqlSchema,
  TagsGraphqlSchema,
  ScriptsGraphqlSchema,
];