import gql from 'graphql-tag';

export const REMOVE_ALL_GAUGES = gql`
  mutation removeGauges($sourceId: ID!) {
    removeGauges(sourceId: $sourceId)
  }
`;

export interface Vars {
  sourceId: string;
}

export interface Result {
  removeGauges: string[];
}
