import { Gauge, NamedNode } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

const Core = gql`
  fragment GaugeCore on Gauge {
    id
    name
    code
    levelUnit
    flowUnit
    url
  }
`;

export type GaugeCore = Pick<
  Gauge,
  'id' | 'name' | 'code' | 'levelUnit' | 'flowUnit' | 'url'
>;

const Location = gql`
  fragment GaugeLocation on Gauge {
    location {
      id
      kind
      coordinates
    }
  }
`;

export interface GaugeLocation {
  location: Pick<
    NonNullable<Gauge['location']>,
    'id' | 'kind' | 'coordinates'
  > | null;
}

const HarvestInfo = gql`
  fragment GaugeHarvestInfo on Gauge {
    requestParams
  }
`;

export type GaugeHarvestInfo<RP = any> = Pick<Gauge<RP>, 'requestParams'>;

const LastMeasurement = gql`
  fragment GaugeLastMeasurement on Gauge {
    lastMeasurement {
      timestamp
      flow
      level
    }
  }
`;

export type GaugeLastMeasurement = Pick<Gauge, 'latestMeasurement'>;

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

export type GaugeStatus = Pick<Gauge, 'status'>;

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
      name
    }
  }
`;

export interface GaugeSource {
  source: NamedNode;
}

export const GaugeFragments = {
  Core,
  Location,
  HarvestInfo,
  LastMeasurement,
  Measurements,
  Source,
  Status,
};
