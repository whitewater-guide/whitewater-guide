import SourceBreadcrumb from './SourceBreadcrumb';
import { gaugeBreadcrumbs } from '../gauges';
import { mapKeys } from 'lodash';

export const sourceBreadcrumbs = {
  '/sources': 'Sources',
  '/sources/new': 'New',
  '/sources/:sourceId': SourceBreadcrumb,
  '/sources/:sourceId/settings': 'Settings',
  ...mapKeys(gaugeBreadcrumbs, (v, key) => `/sources/:sourceId${key}`),
};
