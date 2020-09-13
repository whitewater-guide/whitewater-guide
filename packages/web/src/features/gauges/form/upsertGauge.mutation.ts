import { GaugeFragments } from '@whitewater-guide/clients';
import { GaugeInput } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const UPSERT_GAUGE = gql`
  mutation upsertGauge($gauge: GaugeInput!) {
    upsertGauge(gauge: $gauge) {
      ...GaugeCore
      ...GaugeLocation
      ...GaugeHarvestInfo
    }
  }
  ${GaugeFragments.Core}
  ${GaugeFragments.Location}
  ${GaugeFragments.HarvestInfo}
`;

export interface MVars {
  gauge: GaugeInput<object | null>;
}
