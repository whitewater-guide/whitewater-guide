import { Unit } from '@whitewater-guide/commons';
import React, { useMemo, useState } from 'react';
import { Query } from 'react-apollo';
import {
  MeasurementsResult,
  MeasurementsVars,
  MEASUREMENTS_QUERY,
} from '../measurements';
import { PureChartProvider } from './PureChartProvider';
import { ChartProps } from './types';

export const ChartProvider: React.FC<ChartProps> = React.memo((props) => {
  const { gauge, section, children } = props;
  const [days, onChangeDays] = useState(1);
  const [unit, onChangeUnit] = useState(
    gauge.flowUnit ? Unit.FLOW : Unit.LEVEL,
  );
  const unitChangeable = useMemo(() => !!gauge.flowUnit && !!gauge.levelUnit, [
    gauge,
  ]);
  const variables = useMemo(() => {
    const vars: MeasurementsVars = { days, gaugeId: gauge.id };
    if (section) {
      vars.sectionId = section.id;
    }
    return vars;
  }, [days, gauge, section]);

  return (
    <Query<MeasurementsResult, MeasurementsVars>
      query={MEASUREMENTS_QUERY}
      variables={variables}
    >
      {(queryProps) => (
        <PureChartProvider
          days={days}
          onChangeDays={onChangeDays}
          unit={unit}
          unitChangeable={unitChangeable}
          onChangeUnit={onChangeUnit}
          gauge={gauge}
          section={section}
          queryProps={queryProps}
        >
          {children}
        </PureChartProvider>
      )}
    </Query>
  );
});

ChartProvider.displayName = 'ChartProvider';
