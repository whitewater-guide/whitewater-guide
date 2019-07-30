import {
  GaugeCore,
  GaugeFragments,
  GaugeHarvestInfo,
  GaugeLocation,
} from '@whitewater-guide/clients';
import gql from 'graphql-tag';

export const GAUGE_FORM_QUERY = gql`
  query gaugeForm($gaugeId: ID) {
    gauge(id: $gaugeId) {
      ...GaugeCore
      ...GaugeLocation
      ...GaugeHarvestInfo
    }
  }
  ${GaugeFragments.Core}
  ${GaugeFragments.Location}
  ${GaugeFragments.HarvestInfo}
`;

export interface QVars {
  gaugeId?: string;
}

export interface QResult {
  gauge: GaugeCore & GaugeHarvestInfo<object | null> & GaugeLocation;
}
