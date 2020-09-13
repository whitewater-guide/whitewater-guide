import { Region } from '@whitewater-guide/commons';
import sortBy from 'lodash/sortBy';

import { FieldResolvers } from '~/apollo';
import { timestampResolvers } from '~/db';

import { RegionRaw } from '../types';
import banners from './banners';
import bounds from './bounds';
import editable from './editable';
import gauges from './gauges';
import hasPremiumAccess from './hasPremiumAccess';
import mediaSummary from './mediaSummary';
import rivers from './rivers';
import sections from './sections';
import sources from './sources';

export const regionFieldResolvers: FieldResolvers<RegionRaw, Region> = {
  seasonNumeric: (region) => region.season_numeric,
  coverImage: (region) => region.cover_image,
  mapsSize: (region) => region.maps_size,
  pois: (region) => sortBy(region.pois || [], 'name'),
  banners,
  bounds,
  editable,
  hasPremiumAccess,
  rivers,
  sections,
  gauges,
  sources,
  mediaSummary,
  ...timestampResolvers,
};
