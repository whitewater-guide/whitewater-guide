import { Measurement } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const MEASUREMENTS_QUERY = gql`
  query measurements($gaugeId: ID, $sectionId: ID, $days: Int!) {
    measurements(gaugeId: $gaugeId, sectionId: $sectionId, days: $days) {
      timestamp
      flow
      level
    }
  }
`;

export interface MeasurementsVars {
  gaugeId?: string;
  sectionId?: string;
  days: number;
}

export interface MeasurementsResult {
  measurements: Measurement[];
}
