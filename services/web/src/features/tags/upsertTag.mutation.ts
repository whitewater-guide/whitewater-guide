import gql from 'graphql-tag';

export const UPSERT_TAG = gql`
  mutation upsertTag($tag: TagInput!) {
    upsertTag(tag: $tag) {
      id
      name
      category
    }
  }
`;
