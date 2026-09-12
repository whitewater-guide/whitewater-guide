import { gql } from '@apollo/client';

import type { MeasurementsFilter } from './types';

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

export interface MeasurementRow {
  __typename?: 'Measurement';
  timestamp: string;
  flow?: number | null;
  level?: number | null;
}

export interface MeasurementsQueryData {
  measurements: MeasurementRow[];
}

export interface MeasurementsQueryVariables {
  gaugeId?: string | null;
  sectionId?: string | null;
  days?: number | null;
  filter?: MeasurementsFilter | null;
}
