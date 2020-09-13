import { GaugeFragments } from '@whitewater-guide/clients';
import { Gauge } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const GAUGE_DETAILS = gql`
  query viewGaugeQuery($gaugeId: ID) {
    gauge(id: $gaugeId) {
      ...GaugeCore
      ...GaugeLocation
      ...GaugeHarvestInfo
      ...GaugeSource
      ...GaugeStatus
      ...GaugeLatestMeasurement
    }
  }
  ${GaugeFragments.Core}
  ${GaugeFragments.Location}
  ${GaugeFragments.HarvestInfo}
  ${GaugeFragments.Source}
  ${GaugeFragments.Status}
  ${GaugeFragments.LatestMeasurement}
`;

export interface QVars {
  gaugeId: string;
}

export interface QResult {
  gauge: Gauge | null;
}
