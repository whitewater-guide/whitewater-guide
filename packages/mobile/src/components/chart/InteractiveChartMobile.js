import { InteractiveChart } from '../../commons/features/charts';
import InteractiveChartLayout from './InteractiveChartLayout';
import Chart from './Chart';
import ChartFlowToggle from './ChartFlowToggle';
import ChartPeriodToggle from './ChartPeriodToggle';

export default InteractiveChart(
  InteractiveChartLayout,
  Chart,
  ChartFlowToggle,
  ChartPeriodToggle,
);
