import gql from 'graphql-tag';

const REMOVE_SECTION = gql`
  mutation removeSection($id: ID!) {
    removeSection(id: $id)
  }
`;

export default REMOVE_SECTION;
