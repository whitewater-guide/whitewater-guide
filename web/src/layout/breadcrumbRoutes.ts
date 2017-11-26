import { regionBreadcrumbs } from '../features/regions';
import { sourceBreadcrumbs } from '../features/sources';
import { tagsBreadcrumbs } from '../features/tags';

export default {
  '/': 'Home',
  '/403': 'Unauthorized',
  ...regionBreadcrumbs,
  ...sourceBreadcrumbs,
  ...tagsBreadcrumbs,
};
