import { NamedNode, River } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const RIVER_FORM_QUERY = gql`
  query riverForm($riverId: ID) {
    river(id: $riverId) {
      id
      name
      altNames
      region {
        id
        name
      }
    }
  }
`;

export interface QVars {
  riverId?: string;
}

export interface QResult {
  river: Pick<River, 'id' | 'name' | 'altNames'> & { region: NamedNode };
}
