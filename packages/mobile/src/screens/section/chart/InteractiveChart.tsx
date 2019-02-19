import {
  createInteractiveChart,
  InteractiveChartInnerProps,
  InteractiveChartOuterProps,
  withChart,
} from '@whitewater-guide/clients';
import { compose } from 'recompose';
import { ErrorBoundaryFallback, withLoading } from '../../../components';
import {
  Chart,
  ChartFlowToggle,
  ChartPeriodToggle,
} from '../../../components/chart';
import { trackError } from '../../../core/errors';
import ChartLayout from './ChartLayout';

const reportChartError = (error: Error, componentStack: string) =>
  trackError('interactive_chart', error, componentStack);

const InteractiveChart = createInteractiveChart(
  ChartLayout,
  Chart,
  ChartFlowToggle,
  ChartPeriodToggle,
  { FallbackComponent: ErrorBoundaryFallback, onError: reportChartError },
);

const container = compose<
  InteractiveChartInnerProps,
  InteractiveChartOuterProps
>(
  withChart,
  withLoading<InteractiveChartInnerProps>(
    (props) => props.measurements.loading,
  ),
);

export default container(InteractiveChart);
