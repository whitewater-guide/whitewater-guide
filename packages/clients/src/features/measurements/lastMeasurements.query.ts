import { Measurement } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const LAST_MEASUREMENTS_QUERY = gql`
  query lastMeasurements($gaugeId: ID, $sectionId: ID, $days: Int!) {
    lastMeasurements(gaugeId: $gaugeId, sectionId: $sectionId, days: $days) {
      timestamp
      flow
      level
    }
  }
`;

export interface LastMeasurementsVars {
  gaugeId?: string;
  sectionId?: string;
  days: number;
}

export interface LastMeasurementsResult {
  lastMeasurements: Measurement[];
}
