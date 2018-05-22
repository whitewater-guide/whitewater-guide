import { FetchPolicy } from 'apollo-client';
import { graphql } from 'react-apollo';
import { Overwrite } from 'type-zoo';
import { Measurement } from '../../../ww-commons';
import { LAST_MEASUREMENTS_QUERY } from './lastMeasurements.query';

interface TVars {
  gaugeId?: string;
  sectionId?: string;
  days: number;
}

type MeasurementRaw = Overwrite<Measurement, { timestamp: string}>;

interface Result {
  lastMeasurements: MeasurementRaw[];
}

export interface WithMeasurements {
  measurements: {
    data: Measurement[];
    loading: boolean;
    refresh: () => void;
  };
}

export const withLastMeasurements = (fetchPolicy: FetchPolicy = 'cache-and-network') =>
  graphql<TVars, Result, TVars, WithMeasurements>(
    LAST_MEASUREMENTS_QUERY,
    {
      alias: 'withLastMeasurements',
      options: () => ({ fetchPolicy, notifyOnNetworkStatusChange: true }),
      props: ({ data }) => {
        const { loading, lastMeasurements, refetch } = data!;
        const origMeasurement: MeasurementRaw[] = lastMeasurements || [];
        const measurements = origMeasurement.reduceRight(
          (acc, v) => {
            acc.push({ ...v, timestamp: new Date(v.timestamp) });
            return acc;
          },
          [] as Measurement[],
        );
        return {
          measurements: {
            data: measurements,
            loading,
            refresh: refetch,
          },
        };
      },
    },
  );
