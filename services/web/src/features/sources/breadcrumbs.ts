import gql from 'graphql-tag';
import mapKeys from 'lodash/mapKeys';
import { BreadcrumbsMap } from '../../components/breadcrumbs';
import { gaugeBreadcrumbs } from '../gauges';

const SOURCE_NAME = gql`
  query sourceBreadcrumb($id: ID!) {
    node: source(id: $id) {
      id
      name
    }
  }
`;

export const sourceBreadcrumbs: BreadcrumbsMap = {
  '/sources': 'Sources',
  '/sources/new': 'New',
  '/sources/:sourceId': { query: SOURCE_NAME },
  '/sources/:sourceId/settings': 'Settings',
  ...mapKeys(gaugeBreadcrumbs, (v, key) => `/sources/:sourceId${key}`),
};
