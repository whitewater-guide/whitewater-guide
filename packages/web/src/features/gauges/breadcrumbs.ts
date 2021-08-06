import { BreadcrumbsMap } from '../../components/breadcrumbs';
import { GaugeBreadcrumbDocument } from './gaugeBreadcrumb.generated';

export const gaugeBreadcrumbs: BreadcrumbsMap = {
  '/gauges': 'Gauges',
  '/gauges/new': 'New',
  '/gauges/:gaugeId': { query: GaugeBreadcrumbDocument },
  '/gauges/:gaugeId/settings': 'Settings',
};
