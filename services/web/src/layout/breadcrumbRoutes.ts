import { bannerBreadcrumbs } from '../features/banners/breadcrumbs';
import { groupsBreadcrumbs } from '../features/groups/breadcrumbs';
import { historyBreadcrumbs } from '../features/history/breadcrumbs';
import { regionBreadcrumbs } from '../features/regions/breadcrumbs';
import { sourceBreadcrumbs } from '../features/sources/breadcrumbs';
import { suggestionsBreadcrumbs } from '../features/suggestions/breadcrumbs';
import { tagsBreadcrumbs } from '../features/tags/breadcrumbs';

export default {
  '/': 'Home',
  '/403': 'Forbidden',
  '/404': 'Not found',
  ...regionBreadcrumbs,
  ...sourceBreadcrumbs,
  ...tagsBreadcrumbs,
  ...groupsBreadcrumbs,
  ...bannerBreadcrumbs,
  ...historyBreadcrumbs,
  ...suggestionsBreadcrumbs,
};
