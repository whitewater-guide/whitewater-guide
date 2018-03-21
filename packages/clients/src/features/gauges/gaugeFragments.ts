import gql from 'graphql-tag';

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
      kind
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

const LastMeasurement = gql`
  fragment GaugeLastMeasurement on Gauge {
    lastMeasurement {
      timestamp
      flow
      level
    }
  }
`;

const Status = gql`
  fragment GaugeStatus on Gauge {
    status {
      timestamp
      success
      count
      error
    }
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
  LastMeasurement,
  Measurements,
  Source,
  Status,
};
