import gql from 'graphql-tag';
import { Tag } from '../../../ww-commons';

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
