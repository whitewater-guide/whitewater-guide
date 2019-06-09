import { Gauge } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const TOGGLE_ALL_GAUGES = gql`
  mutation toggleAllGauges(
    $sourceId: ID!
    $enabled: Boolean!
    $linkedOnly: Boolean
  ) {
    toggleAllGauges(
      sourceId: $sourceId
      enabled: $enabled
      linkedOnly: $linkedOnly
    ) {
      id
      enabled
    }
  }
`;

export interface Vars {
  sourceId: string;
  enabled: boolean;
  linkedOnly?: boolean;
}

export interface Result {
  toggleAllGauges: Array<Pick<Gauge, 'id' | 'enabled'>>;
}
