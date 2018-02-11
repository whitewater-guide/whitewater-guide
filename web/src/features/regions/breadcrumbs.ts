import { riverBreadcrumbs } from '../rivers';
import { sectionBreadcrumbs } from '../sections';
import RegionBreadcrumb from './RegionBreadcrumb';
import { mapKeys } from 'lodash';

export const regionBreadcrumbs = {
  '/regions': 'Regions',
  '/regions/new': 'New',
  '/regions/:regionId': RegionBreadcrumb,
  '/regions/:regionId/settings': 'Settings',
  ...mapKeys(riverBreadcrumbs, (v, key) => `/regions/:regionId${key}`),
  ...mapKeys(sectionBreadcrumbs, (v, key) => `/regions/:regionId${key}`),
};
