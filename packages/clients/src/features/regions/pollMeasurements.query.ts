import gql from 'graphql-tag';

export const POLL_REGION_MEASUREMENTS = gql`
  query pollRegionMeasurements($regionId: ID) {
    region(id: $regionId) {
      id
      gauges {
        nodes {
          id
          lastMeasurement {
            flow
            level
            timestamp
          }
        }
      }
    }
  }`;

export interface PollVars {
  regionId: string;
}
