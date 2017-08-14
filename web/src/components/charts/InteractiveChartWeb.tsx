import { InteractiveChart } from '../../ww-clients/features/charts';
import Chart from './Chart';
import ChartFlowToggle from './ChartFlowToggle';
import ChartPeriodToggle from './ChartPeriodToggle';
import InteractiveChartLayout from './InteractiveChartLayout';

const InteractiveChartWeb = InteractiveChart(
  InteractiveChartLayout,
  Chart,
  ChartFlowToggle,
  ChartPeriodToggle,
);

export default InteractiveChartWeb;
