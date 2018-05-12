import { compose } from 'recompose';
import { withLoading } from '../../../components';
import { Chart, ChartFlowToggle, ChartPeriodToggle } from '../../../components/chart';
import {
  createInteractiveChart,
  InteractiveChartInnerProps,
  InteractiveChartOuterProps,
  withChart,
} from '../../../ww-clients/features/charts';
import ChartLayout from './ChartLayout';

const InteractiveChart = createInteractiveChart(
  ChartLayout,
  Chart,
  ChartFlowToggle,
  ChartPeriodToggle,
);

const container = compose<InteractiveChartInnerProps, InteractiveChartOuterProps>(
  withChart,
  withLoading<InteractiveChartInnerProps>((props) => props.measurements.loading),
);

export default container(InteractiveChart);
