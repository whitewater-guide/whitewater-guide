import { FieldResolvers } from '@apollo';
import { Point } from '@whitewater-guide/commons';
import { PointRaw } from '../types';

const resolvers: FieldResolvers<PointRaw, Point> = {
  coordinates: ({ coordinates }) => coordinates.coordinates,
};

export default resolvers;
