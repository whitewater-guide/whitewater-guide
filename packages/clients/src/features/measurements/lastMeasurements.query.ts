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
