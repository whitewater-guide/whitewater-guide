import mapKeys from 'lodash/mapKeys';

import type { BreadcrumbsMap } from '../../components/breadcrumbs';
import { riverBreadcrumbs } from '../rivers';
import { sectionBreadcrumbs } from '../sections';
import { RegionBreadcrumbDocument } from './regionBreadcrumb.generated';

export const regionBreadcrumbs: BreadcrumbsMap = {
  '/regions': 'Regions',
  '/regions/new': 'New',
  '/regions/:regionId': { query: RegionBreadcrumbDocument },
  '/regions/:regionId/settings': 'Settings',
  '/regions/:regionId/admin': 'Administrate',
  ...mapKeys(riverBreadcrumbs, (v, key) => `/regions/:regionId${key}`),
  ...mapKeys(sectionBreadcrumbs, (v, key) => `/regions/:regionId${key}`),
};
