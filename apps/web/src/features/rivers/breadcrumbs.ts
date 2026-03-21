import type { BreadcrumbsMap } from '../../components/breadcrumbs';
import { RiverBreadcrumbDocument } from './riverBreadcrumb.generated';

export const riverBreadcrumbs: BreadcrumbsMap = {
  '/rivers': 'Rivers',
  '/rivers/new': 'New',
  '/rivers/:riverId': { query: RiverBreadcrumbDocument },
  '/rivers/:riverId/settings': 'Settings',
};
