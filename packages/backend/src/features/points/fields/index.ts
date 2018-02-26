import { Geometry, Point as WKXPoint } from 'wkx';
import { FieldResolvers } from '../../../apollo';
import { Point } from '../../../ww-commons';
import { PointRaw } from '../types';

const resolvers: FieldResolvers<PointRaw, Point> = {
  coordinates: ({ coordinates }) => {
    const { x, y, z } = Geometry.parse(coordinates) as WKXPoint;
    return [x, y, z];
  },
};

export default resolvers;
