import {
  MeasurementsFilter,
  Node,
  SectionFlowsFragment,
} from '@whitewater-guide/schema';
import { useMemo } from 'react';

import { useFormulas } from '../sections';
import { useMeasurementsQuery } from './measurements.generated';
import { ChartDataPoint, WithChartData } from './types';

export function useChartMeasurements(
  filter: MeasurementsFilter,
  gauge?: Node,
  section?: Node & SectionFlowsFragment,
): WithChartData['measurements'] {
  const query = useMeasurementsQuery({
    variables: {
      filter,
      gaugeId: gauge?.id,
      sectionId: section?.id,
    },
    fetchPolicy: 'no-cache',
  });
  const formulas = useFormulas(section);

  return useMemo(() => {
    const original = query.data?.measurements || [];
    const data = original.reduceRight((acc, v) => {
      acc.push({
        flow: formulas.flows(v.flow),
        level: formulas.levels(v.level),
        timestamp: new Date(v.timestamp),
      });
      return acc;
    }, [] as ChartDataPoint[]);
    return {
      data,
      refresh: query.refetch,
      loading: query.loading,
    };
  }, [query, formulas]);
}
