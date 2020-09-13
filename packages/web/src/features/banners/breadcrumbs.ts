import gql from 'graphql-tag';

import { BreadcrumbsMap } from '../../components/breadcrumbs';

const BANNER_NAME = gql`
  query bannerBreadcrumb($id: ID!) {
    node: banner(id: $id) {
      id
      name
    }
  }
`;

export const bannerBreadcrumbs: BreadcrumbsMap = {
  '/banners': 'Banners',
  '/banners/new': 'New',
  '/banners/:bannerId': { query: BANNER_NAME },
  '/banners/:bannerId/settings': 'Settings',
};
