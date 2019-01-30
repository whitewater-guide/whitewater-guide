import gql from 'graphql-tag';

const REMOVE_BANNER = gql`
  mutation removeBanner($id: ID!) {
    removeBanner(id: $id) {
      id
      deleted
    }
  }
`;

export default REMOVE_BANNER;
