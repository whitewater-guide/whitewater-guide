import gql from 'graphql-tag';

export const LIST_TAGS = gql`
  query listTags {
    tags {
      id
      name
      category
    }
  }
`;
