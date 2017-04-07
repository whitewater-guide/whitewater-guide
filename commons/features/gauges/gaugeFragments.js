import { gql } from 'react-apollo';

const Core = gql`
  fragment GaugeCore on Gauge {
    _id
    name
    code
    source {
      _id
    }
    levelUnit
    flowUnit
    url
  }
`;

const Location = gql`
  fragment GaugeLocation on Gauge {
    location {
      _id
      coordinates
      altitude
    }
  }
`;

const HarvestInfo = gql`
  fragment GaugeHarvestInfo on Gauge {
    requestParams
    cron
  }
`;

const Measurements = gql`
  fragment GaugeMeasurements on Gauge {
    lastTimestamp
    lastLevel
    lastFlow
    measurements {
      date
      level
      flow
    }
  }
`;

// TODO: remove when https://github.com/apollographql/graphql-anywhere/issues/38 is resolved
const All = gql`
  fragment GaugeAll on Gauge {
    ...GaugeCore
    ...GaugeLocation
    ...GaugeHarvestInfo
    ...GaugeMeasurements
  }
  ${Core}
  ${Location}
  ${HarvestInfo}
  ${Measurements}
`;

export const GaugeFragments = {
  All,
  Core,
  Location,
  HarvestInfo,
  Measurements,
};
