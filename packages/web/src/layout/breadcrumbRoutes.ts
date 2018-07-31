import { bannerBreadcrumbs } from '../features/banners';
import { groupsBreadcrumbs } from '../features/groups';
import { regionBreadcrumbs } from '../features/regions';
import { sourceBreadcrumbs } from '../features/sources';
import { tagsBreadcrumbs } from '../features/tags';

export default {
  '/': 'Home',
  '/403': 'Forbidden',
  '/404': 'Not found',
  ...regionBreadcrumbs,
  ...sourceBreadcrumbs,
  ...tagsBreadcrumbs,
  ...groupsBreadcrumbs,
  ...bannerBreadcrumbs,
};
