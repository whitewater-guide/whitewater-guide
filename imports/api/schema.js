import Sources from '../api/sources/server/Sources.graphql';
import Regions from '../api/regions/server/Regions.graphql';
import User from '../api/users/server/User.graphql';
import Points from '../api/points/server/Points.graphql';
import Gauges from '../api/gauges/server/Gauges.graphql';
import Jobs from '../api/jobs/server/Jobs.graphql';

const SchemaDefinition = `
  scalar JSON
  scalar Date
  
  schema {
    query: Query,
    mutation: Mutation,
  }
`;

export const typeDefs = [
  SchemaDefinition,
  User,
  Regions,
  Points,
  Sources,
  Gauges,
  Jobs,
];