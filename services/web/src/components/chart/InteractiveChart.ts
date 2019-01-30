import { createInteractiveChart } from '@whitewater-guide/clients';
import Chart from './Chart';
import ChartFlowToggle from './ChartFlowToggle';
import ChartLayout from './ChartLayout';
import ChartPeriodToggle from './ChartPeriodToggle';

export default createInteractiveChart(
  ChartLayout,
  Chart,
  ChartFlowToggle,
  ChartPeriodToggle,
);
