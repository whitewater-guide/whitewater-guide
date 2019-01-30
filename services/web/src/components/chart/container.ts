import {
  InteractiveChartInnerProps,
  InteractiveChartOuterProps,
  withChart,
} from '@whitewater-guide/clients';
import { compose } from 'recompose';
import { withLoading } from '../withLoading';

export default compose<InteractiveChartInnerProps, InteractiveChartOuterProps>(
  withChart,
  withLoading<InteractiveChartInnerProps>(
    (props) => props.measurements.loading,
  ),
);
