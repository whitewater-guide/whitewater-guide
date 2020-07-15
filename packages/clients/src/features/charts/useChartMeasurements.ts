import { useQuery } from 'react-apollo';
import { MEASUREMENTS_QUERY } from '../measurements';
import {
  MeasurementsVars,
  MeasurementsResult,
} from '../measurements/measurements.query';
import { WithMeasurements } from './types';
import { useMemo } from 'react';
import { useFormulas } from '../sections';
import {
  Section,
  Measurement,
  MeasurementsFilter,
  Gauge,
} from '@whitewater-guide/commons';

const empty: Array<Measurement<string>> = [];

export function useChartMeasurements(
  filter: MeasurementsFilter<Date>,
  gauge?: Gauge,
  section?: Section,
): WithMeasurements['measurements'] {
  const query = useQuery<MeasurementsResult, MeasurementsVars>(
    MEASUREMENTS_QUERY,
    {
      variables: {
        filter: {
          from: filter.from?.toISOString(),
          to: filter.to?.toISOString(),
        },
        gaugeId: gauge?.id,
        sectionId: section?.id,
      },
      fetchPolicy: 'no-cache',
    },
  );
  const formulas = useFormulas(section);
  return useMemo(() => {
    const original = query.data?.measurements || empty;
    const data = original.reduceRight((acc, v) => {
      acc.push({
        flow: formulas.flows(v.flow),
        level: formulas.levels(v.level),
        timestamp: new Date(v.timestamp),
      });
      return acc;
    }, [] as Array<Measurement<Date>>);
    return {
      data,
      refresh: query.refetch,
      loading: query.loading,
    };
  }, [query, formulas]);
}
