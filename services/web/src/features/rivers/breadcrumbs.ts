import gql from 'graphql-tag';
import { BreadcrumbsMap } from '../../components/breadcrumbs';

const RIVER_NAME = gql`
  query riverBreadcrumb($id: ID!) {
    node: river(id: $id) {
      id
      name
      altNames
    }
  }
`;

export const riverBreadcrumbs: BreadcrumbsMap = {
  '/rivers': 'Rivers',
  '/rivers/new': 'New',
  '/rivers/:riverId': { query: RIVER_NAME },
  '/rivers/:riverId/settings': 'Settings',
};
