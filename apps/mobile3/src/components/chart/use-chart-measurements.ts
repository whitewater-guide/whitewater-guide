import { useQuery } from '@apollo/client';
import { useMemo } from 'react';

import {
  MEASUREMENTS_QUERY,
  type MeasurementsQueryData,
  type MeasurementsQueryVariables,
} from './measurements';
import type {
  ChartDataPoint,
  ChartMeasurementsState,
  GaugeForChart,
  MeasurementsFilter,
  SectionForChart,
} from './types';
import { useFormulas } from './use-formulas';

export function useChartMeasurements(
  filter: MeasurementsFilter,
  gauge: GaugeForChart,
  section?: SectionForChart,
): ChartMeasurementsState {
  const query = useQuery<MeasurementsQueryData, MeasurementsQueryVariables>(
    MEASUREMENTS_QUERY,
    {
      variables: {
        filter,
        gaugeId: gauge?.id,
        sectionId: section?.id,
      },
      fetchPolicy: 'no-cache',
    },
  );
  const formulas = useFormulas(section);

  return useMemo(() => {
    const original = query.data?.measurements || [];
    const data = original.reduceRight<ChartDataPoint[]>((acc, row) => {
      acc.push({
        flow: formulas.flows(row.flow ?? null),
        level: formulas.levels(row.level ?? null),
        timestamp: new Date(row.timestamp),
      });
      return acc;
    }, []);
    return {
      data,
      refresh: async () => {
        await query.refetch().catch(() => {});
      },
      loading: query.loading,
      error: query.error,
    };
  }, [query, formulas]);
}
