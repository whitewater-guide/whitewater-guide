import {SourcesGraphqlSchema} from './sources';
import {RegionsGraphqlSchema} from './regions';
import {RiversGraphqlSchema} from './rivers';
import {UserGraphqlSchema} from './users';
import {PointsGraphqlSchema} from './points';
import {GaugesGraphqlSchema} from './gauges';
import {MediaGraphqlSchema} from './media';
import {SectionsGraphqlSchema} from './sections';
import {TagsGraphqlSchema} from './tags';
import {ScriptsGraphqlSchema} from './scripts';
import {EmailGraphqlSchema} from './emails';

const SchemaDefinition = `
  scalar JSON
  scalar Date
  scalar UploadedFile
  
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
    subscription: Subscription,
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
  TagsGraphqlSchema,
  ScriptsGraphqlSchema,
  EmailGraphqlSchema,
];