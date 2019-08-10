import { GaugeFragments } from '@whitewater-guide/clients';
import { Connection, Gauge, Page } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const LIST_GAUGES = gql`
  query listGauges($sourceId: ID, $page: Page) {
    gauges(sourceId: $sourceId, page: $page)
      @connection(key: "gauges", filter: ["sourceId"]) {
      nodes {
        ...GaugeCore
        ...GaugeLocation
        ...GaugeHarvestInfo
        ...GaugeStatus
        ...GaugeLastMeasurement
        source {
          id
        }
        enabled
      }
      count
    }
  }
  ${GaugeFragments.Core}
  ${GaugeFragments.LastMeasurement}
  ${GaugeFragments.Location}
  ${GaugeFragments.HarvestInfo}
  ${GaugeFragments.Status}
`;

export interface QVars {
  sourceId: string;
  page?: Page;
}

export interface QResult {
  gauges: Connection<Gauge>;
}
