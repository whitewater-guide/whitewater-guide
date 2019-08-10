import gql from 'graphql-tag';
import { BreadcrumbsMap } from '../../components/breadcrumbs';

const GAUGE_NAME = gql`
  query gaugeBreadcrumb($id: ID!) {
    node: gauge(id: $id) {
      id
      name
    }
  }
`;

export const gaugeBreadcrumbs: BreadcrumbsMap = {
  '/gauges': 'Gauges',
  '/gauges/new': 'New',
  '/gauges/:gaugeId': { query: GAUGE_NAME },
  '/gauges/:gaugeId/settings': 'Settings',
};
