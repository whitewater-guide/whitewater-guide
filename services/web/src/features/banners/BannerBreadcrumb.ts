import gql from 'graphql-tag';
import { createBreadcrumb } from '../../components';

export const BANNER_NAME = gql`
  query bannerName($id: ID!) {
    banner(id: $id) {
      id
      name
    }
  }
`;

export default createBreadcrumb({ query: BANNER_NAME, resourceType: 'banner' });
