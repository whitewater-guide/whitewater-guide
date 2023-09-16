import { sortBy } from 'lodash';

import type { RegionResolvers } from '../../../apollo/index';
import { timestampedResolvers } from '../../../apollo/index';
import banners from './banners';
import bounds from './bounds';
import editable from './editable';
import favorite from './favorite';
import gauges from './gauges';
import hasPremiumAccess from './hasPremiumAccess';
import mediaSummary from './mediaSummary';
import rivers from './rivers';
import room from './room';
import sections from './sections';
import sources from './sources';

export const regionFieldResolvers: RegionResolvers = {
  seasonNumeric: (region) => region.season_numeric,
  coverImage: (region) => region.cover_image,
  mapsSize: (region) => region.maps_size,
  pois: (region) => sortBy(region.pois || [], 'name'),
  banners,
  bounds,
  editable,
  favorite,
  hasPremiumAccess,
  rivers,
  room,
  sections,
  gauges,
  sources,
  mediaSummary,
  ...timestampedResolvers,
};
