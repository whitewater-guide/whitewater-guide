import Sources from '../api/sources/server/Sources.graphql';
import Regions from '../api/regions/server/Regions.graphql';
import Rivers from '../api/rivers/server/Rivers.graphql';
import User from '../api/users/server/User.graphql';
import Points from '../api/points/server/Points.graphql';
import Gauges from '../api/gauges/server/Gauges.graphql';
import Media from '../api/media/server/Media.graphql';
import Sections from '../api/sections/server/Sections.graphql';
import Jobs from '../api/jobs/server/Jobs.graphql';

const SchemaDefinition = `
  scalar JSON
  scalar Date
  
  enum SortDirection {
    asc
    desc
  }
  
  schema {
    query: Query,
    mutation: Mutation,
  }
`;

export const typeDefs = [
  SchemaDefinition,
  User,
  Regions,
  Rivers,
  Points,
  Sources,
  Gauges,
  Jobs,
  Media,
  Sections,
];