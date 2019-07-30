import { NamedNode } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const REGION_EDITORS_QUERY = gql`
  query regionEditors($regionId: ID!) {
    editors: regionEditors(regionId: $regionId) {
      id
      name
    }
  }
`;

export interface QVars {
  regionId: string;
}

export interface QResult {
  editors: NamedNode[];
}
