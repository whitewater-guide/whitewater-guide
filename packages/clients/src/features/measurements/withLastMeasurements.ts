import { FetchPolicy } from 'apollo-client';
import { graphql } from 'react-apollo';
import { Measurement } from '../../../ww-commons';
import { LAST_MEASUREMENTS_QUERY } from './lastMeasurements.query';

interface Result {
  lastMeasurements: Measurement[];
}

export interface WithMeasurements {
  measurements: {
    data: Measurement[];
    loading: boolean;
    refresh: () => void;
  };
}

export const withLastMeasurements = (fetchPolicy: FetchPolicy = 'cache-and-network') =>
  graphql<Result, any, WithMeasurements>(
    LAST_MEASUREMENTS_QUERY,
    {
      alias: 'withLastMeasurements',
      options: { fetchPolicy, notifyOnNetworkStatusChange: true },
      props: ({ data }) => {
        const { loading, lastMeasurements, refetch } = data!;
        return {
          measurements: {
            data: lastMeasurements || [],
            loading,
            refresh: refetch,
          },
        };
      },
    },
  );
