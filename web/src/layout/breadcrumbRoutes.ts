import { regionBreadcrumbs } from '../features/regions';
import { sourceBreadcrumbs } from '../features/sources';

export default {
  '/': 'Home',
  ...regionBreadcrumbs,
  ...sourceBreadcrumbs,
};
