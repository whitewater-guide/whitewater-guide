import { FieldResolvers } from '@apollo';
import { timestampResolvers } from '@db';
import { Region } from '@ww-commons';
import { RegionRaw } from '../types';
import bounds from './bounds';
import editable from './editable';
import gauges from './gauges';
import hasPremiumAccess from './hasPremiumAccess';
import rivers from './rivers';
import sections from './sections';
import sources from './sources';

export const regionFieldResolvers: FieldResolvers<RegionRaw, Region> = {
  seasonNumeric: region => region.season_numeric,
  coverImage: region => region.cover_image,
  pois: region => region.pois || [],
  bounds,
  editable,
  hasPremiumAccess,
  rivers,
  sections,
  gauges,
  sources,
  ...timestampResolvers,
};
