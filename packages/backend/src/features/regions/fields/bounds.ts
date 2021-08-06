import { RegionResolvers } from '~/apollo';

const boundsResolver: RegionResolvers['bounds'] = ({ bounds }) => {
  const bnds = bounds.coordinates[0];
  bnds.pop();
  return bnds;
};

export default boundsResolver;
