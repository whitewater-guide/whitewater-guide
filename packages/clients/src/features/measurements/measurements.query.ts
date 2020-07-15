import { Measurement, MeasurementsFilter } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const MEASUREMENTS_QUERY = gql`
  query measurements(
    $gaugeId: ID
    $sectionId: ID
    $days: Int
    $filter: MeasurementsFilter
  ) {
    measurements(
      gaugeId: $gaugeId
      sectionId: $sectionId
      days: $days
      filter: $filter
    ) {
      timestamp
      flow
      level
    }
  }
`;

export interface MeasurementsVars {
  gaugeId?: string;
  sectionId?: string | null;
  days?: number;
  filter?: MeasurementsFilter;
}

export interface MeasurementsResult {
  measurements: Measurement[];
}
