import gql from 'graphql-tag';
import mapKeys from 'lodash/mapKeys';

import { BreadcrumbsMap } from '../../components/breadcrumbs';
import { riverBreadcrumbs } from '../rivers';
import { sectionBreadcrumbs } from '../sections';

const REGION_NAME = gql`
  query regionBreadcrumb($id: ID!) {
    node: region(id: $id) {
      id
      name
    }
  }
`;

export const regionBreadcrumbs: BreadcrumbsMap = {
  '/regions': 'Regions',
  '/regions/new': 'New',
  '/regions/:regionId': { query: REGION_NAME },
  '/regions/:regionId/settings': 'Settings',
  '/regions/:regionId/admin': 'Administrate',
  ...mapKeys(riverBreadcrumbs, (v, key) => `/regions/:regionId${key}`),
  ...mapKeys(sectionBreadcrumbs, (v, key) => `/regions/:regionId${key}`),
};
