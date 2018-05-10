import { FieldResolvers } from '../../../apollo';
import { Point } from '../../../ww-commons';
import { PointRaw } from '../types';

const resolvers: FieldResolvers<PointRaw, Point> = {
  coordinates: ({ coordinates }) => coordinates.coordinates,
};

export default resolvers;
