import mapKeys from 'lodash/mapKeys';

import { BreadcrumbsMap } from '../../components/breadcrumbs';
import { gaugeBreadcrumbs } from '../gauges';
import { SourceBreadcrumbDocument } from './sourceBreadcrumb.generated';

export const sourceBreadcrumbs: BreadcrumbsMap = {
  '/sources': 'Sources',
  '/sources/new': 'New',
  '/sources/:sourceId': { query: SourceBreadcrumbDocument },
  '/sources/:sourceId/settings': 'Settings',
  ...mapKeys(gaugeBreadcrumbs, (v, key) => `/sources/:sourceId${key}`),
};
