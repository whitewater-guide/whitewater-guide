import { FieldResolvers } from '../../../apollo';
import { timestampResolvers } from '../../../db';
import { River } from '../../../ww-commons';
import { RiverRaw } from '../types';

const riverFieldResolvers: FieldResolvers<RiverRaw, River> = {
  altNames: river => river.alt_names,
  ...timestampResolvers,
};

export default riverFieldResolvers;