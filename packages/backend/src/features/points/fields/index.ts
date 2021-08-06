import { PointResolvers } from '~/apollo';

const resolvers: PointResolvers = {
  coordinates: ({ coordinates }) => coordinates.coordinates,
};

export default resolvers;
