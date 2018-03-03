import { mapKeys } from 'lodash';
import { gaugeBreadcrumbs } from '../gauges';
import SourceBreadcrumb from './SourceBreadcrumb';

export const sourceBreadcrumbs = {
  '/sources': 'Sources',
  '/sources/new': 'New',
  '/sources/:sourceId': SourceBreadcrumb,
  '/sources/:sourceId/settings': 'Settings',
  ...mapKeys(gaugeBreadcrumbs, (v, key) => `/sources/:sourceId${key}`),
};
