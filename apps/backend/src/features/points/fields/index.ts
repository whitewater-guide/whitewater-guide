import type { PointResolvers } from '../../../apollo/index';

const resolvers: PointResolvers = {
  coordinates: ({ coordinates }) => coordinates.coordinates,
};

export default resolvers;
