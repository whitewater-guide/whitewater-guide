import { Measurement } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const LATEST_MEASUREMENTS_QUERY = gql`
  query latestMeasurements($gaugeId: ID, $sectionId: ID, $days: Int!) {
    latestMeasurements(gaugeId: $gaugeId, sectionId: $sectionId, days: $days) {
      timestamp
      flow
      level
    }
  }
`;

export interface LatestMeasurementsVars {
  gaugeId?: string;
  sectionId?: string;
  days: number;
}

export interface LatestMeasurementsResult {
  latestMeasurements: Measurement[];
}
