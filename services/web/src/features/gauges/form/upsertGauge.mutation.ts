import { GaugeFragments } from '@whitewater-guide/clients';
import gql from 'graphql-tag';

const UPSERT_GAUGE = gql`
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

export default UPSERT_GAUGE;
