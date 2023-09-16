import type { Context, RegionResolvers } from '../../../apollo/index';
import type { ResolvableRegion } from '../types';

const favoriteResolver: RegionResolvers<
  Context,
  ResolvableRegion
>['favorite'] = ({ favorite }) => {
  return favorite ?? false;
};

export default favoriteResolver;
