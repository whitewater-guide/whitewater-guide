import { createBreadcrumb } from '../../components';
import gql from 'graphql-tag';

export const BANNER_NAME = gql`
  query bannerName($id: ID!) {
    banner(id: $id) {
      id
      name
    }
  }
`;

export default createBreadcrumb({ query: BANNER_NAME, resourceType: 'banner' });
