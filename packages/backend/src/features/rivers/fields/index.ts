import type { RiverResolvers } from '../../../apollo/index';
import { timestampedResolvers } from '../../../apollo/index';
import region from './region';
import sections from './sections';

const riverFieldResolvers: RiverResolvers = {
  altNames: (river) => river.alt_names,
  region,
  sections,
  ...timestampedResolvers,
};

export default riverFieldResolvers;
