import { GraphQLFieldResolver } from 'graphql';

import { Context } from '~/apollo';

import { RegionRaw } from '../types';

const boundsResolver: GraphQLFieldResolver<RegionRaw, Context> = async ({
  bounds,
}) => {
  if (!bounds) {
    return null;
  }
  const bnds = bounds.coordinates[0];
  bnds.pop();
  return bnds;
};

export default boundsResolver;
