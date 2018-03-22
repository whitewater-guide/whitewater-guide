import { compose } from 'recompose';
import { InteractiveChartInnerProps, InteractiveChartOuterProps, withChart } from '../../ww-clients/features/charts';
import { withLoading } from '../withLoading';

export default compose<InteractiveChartInnerProps, InteractiveChartOuterProps>(
  withChart,
  withLoading<InteractiveChartInnerProps>(props => props.measurements.loading),
);
