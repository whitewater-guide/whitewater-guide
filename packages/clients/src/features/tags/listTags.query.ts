import { Tag } from '@whitewater-guide/commons';
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

export interface Result {
  tags: Tag[];
}
