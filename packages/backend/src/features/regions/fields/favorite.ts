import { Context, RegionResolvers } from '~/apollo';

import { ResolvableRegion } from '../types';

const favoriteResolver: RegionResolvers<Context, ResolvableRegion>['favorite'] =
  ({ favorite }) => {
    return favorite ?? false;
  };

export default favoriteResolver;
