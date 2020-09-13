import { GaugeFragments } from '@whitewater-guide/clients';
import {
  Connection,
  Gauge,
  GaugesFilter,
  Page,
} from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const LIST_GAUGES = gql`
  query listGauges($filter: GaugesFilter, $page: Page) {
    gauges(filter: $filter, page: $page)
    @connection(key: "gauges", filter: ["filter"]) {
      nodes {
        ...GaugeCore
        ...GaugeLocation
        ...GaugeHarvestInfo
        ...GaugeStatus
        ...GaugeLatestMeasurement
        source {
          id
        }
        enabled
      }
      count
    }
  }
  ${GaugeFragments.Core}
  ${GaugeFragments.LatestMeasurement}
  ${GaugeFragments.Location}
  ${GaugeFragments.HarvestInfo}
  ${GaugeFragments.Status}
`;

export interface QVars {
  filter: GaugesFilter;
  page?: Page;
}

export interface QResult {
  gauges: Connection<Gauge>;
}
