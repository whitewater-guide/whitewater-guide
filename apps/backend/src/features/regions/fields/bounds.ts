import type { RegionResolvers } from '../../../apollo/index';

const boundsResolver: RegionResolvers['bounds'] = ({ bounds }) => {
  const bnds = bounds.coordinates[0];
  bnds.pop();
  return bnds;
};

export default boundsResolver;
