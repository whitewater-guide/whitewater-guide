import { River, RiverInput } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const UPSERT_RIVER = gql`
  mutation upsertRiver($river: RiverInput!) {
    upsertRiver(river: $river) {
      id
      name
      altNames
      region {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export interface MVars {
  river: RiverInput;
}

export interface MResult {
  upsertRiver: River;
}

export default UPSERT_RIVER;
