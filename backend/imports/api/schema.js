import Sources from './sources/Sources.graphql';
import Regions from './regions/Regions.graphql';
import Rivers from './rivers/Rivers.graphql';
import User from './users/User.graphql';
import Points from './points/Points.graphql';
import Gauges from './gauges/Gauges.graphql';
import Media from './media/Media.graphql';
import Sections from './sections/Sections.graphql';
import Jobs from './jobs/Jobs.graphql';
import Tags from './tags/Tags.graphql';

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
  Tags,
  Media,
  Sections,
];