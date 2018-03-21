import { FetchPolicy } from 'apollo-client';
import { graphql } from 'react-apollo';
import { Measurement } from '../../../ww-commons';
import { LAST_MEASUREMENTS_QUERY } from './lastMeasurements.query';

interface Result {
  lastMeasurements: Measurement[];
}

export interface WithMeasurements {
  measurements: Measurement[];
  measurementsLoading: boolean;
}

export const withLastMeasurements = (fetchPolicy: FetchPolicy = 'cache-and-network') =>
  graphql<Result, any, WithMeasurements>(
    LAST_MEASUREMENTS_QUERY,
    {
      alias: 'withLastMeasurements',
      options: { fetchPolicy },
      props: ({ data }) => {
        const { loading, lastMeasurements } = data!;
        return { measurements: lastMeasurements, measurementsLoading: loading };
      },
    },
  );
