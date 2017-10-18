import { gql } from 'react-apollo';

const Core = gql`
  fragment GaugeCore on Gauge {
    id
    language
    name
    code
    levelUnit
    flowUnit
    url
  }
`;

const Location = gql`
  fragment GaugeLocation on Gauge {
    location {
      id
      coordinates
    }
  }
`;

const HarvestInfo = gql`
  fragment GaugeHarvestInfo on Gauge {
    enabled
    requestParams
    cron
  }
`;

const LastMeasurements = gql`
  fragment GaugeLastMeasurements on Gauge {
    lastTimestamp
    lastLevel
    lastFlow
  }
`;

const Measurements = gql`
  fragment GaugeMeasurements on Gauge {
    measurements {
      date
      level
      flow
    }
  }
`;

const Source = gql`
  fragment GaugeSource on Gauge {
    source {
      id
      language
      name
    }
  }
`;

export const GaugeFragments = {
  Core,
  Location,
  HarvestInfo,
  LastMeasurements,
  Measurements,
};
