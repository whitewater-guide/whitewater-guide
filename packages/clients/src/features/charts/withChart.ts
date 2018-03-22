import { compose, pure, StateHandlerMap, withProps, withState, withStateHandlers } from 'recompose';
import { Unit } from '../../../ww-commons';
import { withLastMeasurements, WithMeasurements } from '../measurements';
import { DaysState, InteractiveChartInnerProps, InteractiveChartOuterProps, UnitState } from './types';

export const withChart = compose<InteractiveChartInnerProps, InteractiveChartOuterProps>(
  withState<InteractiveChartOuterProps, number, 'days', 'onChangeDays'>('days', 'onChangeDays', 1),
  withProps<any, InteractiveChartOuterProps>(
    ({ gauge, section }: InteractiveChartOuterProps) => ({ gaugeId: gauge.id, sectionId: section && section.id }),
  ),
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
