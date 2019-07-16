import { Measurement } from '@whitewater-guide/commons';
import React, { useMemo } from 'react';
import { QueryResult } from 'react-apollo';
import {
  LastMeasurementsResult,
  LastMeasurementsVars,
  MeasurementRaw,
} from '../measurements';
import { useFormulas } from '../sections';
import { PureChartContext } from './context';
import { ChartContext } from './types';

interface Props extends ChartContext {
  queryProps: QueryResult<LastMeasurementsResult, LastMeasurementsVars>;
}

const empty: MeasurementRaw[] = [];

export const PureChartProvider: React.FC<Props> = React.memo(
  ({ queryProps, children, ...props }) => {
    const { section } = props;
    const formulas = useFormulas(section);
    const measurements = useMemo(() => {
      const original =
        (queryProps.data && queryProps.data.lastMeasurements) || empty;
      const data = original.reduceRight(
        (acc, v) => {
          acc.push({
            flow: formulas.flows(v.flow),
            level: formulas.levels(v.level),
            timestamp: new Date(v.timestamp),
          });
          return acc;
        },
        [] as Measurement[],
      );
      return {
        data,
        refresh: queryProps.refetch,
        loading: queryProps.loading,
      };
    }, [queryProps, formulas]);
    return (
      <PureChartContext.Provider value={{ ...props, measurements }}>
        {children}
      </PureChartContext.Provider>
    );
  },
);

PureChartProvider.displayName = 'PureChartProvider';
