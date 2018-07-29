import { FieldResolvers } from '@apollo';
import { timestampResolvers } from '@db';
import { River } from '@ww-commons';
import { RiverRaw } from '../types';
import region from './region';
import sections from './sections';

const riverFieldResolvers: FieldResolvers<RiverRaw, River> = {
  altNames: river => river.alt_names,
  region,
  sections,
  ...timestampResolvers,
};

export default riverFieldResolvers;
