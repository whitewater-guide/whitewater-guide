import { compose, pure, StateHandlerMap, withState, withStateHandlers } from 'recompose';
import { Unit } from '../../../ww-commons';
import { withLastMeasurements, WithMeasurements } from '../measurements';
import { DaysState, InteractiveChartInnerProps, InteractiveChartOuterProps, UnitState } from './types';

export const withChart = compose<InteractiveChartInnerProps, InteractiveChartOuterProps>(
  withState<InteractiveChartOuterProps, DaysState, 'days', 'onChangeDays'>('days', 'onChangeDays', { days: 1 }),
  withLastMeasurements(),
  withStateHandlers<UnitState, StateHandlerMap<UnitState>, InteractiveChartOuterProps & DaysState & WithMeasurements>(
    ({ gauge }) => ({
      unit: gauge.flowUnit ? Unit.FLOW : Unit.LEVEL,
      unitChangeable: !!gauge.flowUnit && !!gauge.levelUnit,
    }),
    {
      onChangeDays: () => (unit: Unit) => ({ unit }),
    },
  ),
  pure,
);
