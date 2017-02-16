import ListGauges from "./ListGauges";
import ListGaugesLeft from "./ListGaugesLeft";
import GaugeForm from "./GaugeForm";
import ViewGauge from "./ViewGauge";
import ViewGaugeLeft from "./ViewGaugeLeft";

export const gaugeRoutes = [
  {
    path: '/gauges',
    exact: true,
    content: ListGauges,
    left: ListGaugesLeft,
  },
  {
    path: '/gauges/new',
    content: GaugeForm,
  },
  {
    path: '/gauges/:gaugeId',
    exact: true,
    content: ViewGauge,
    left: ViewGaugeLeft,
  },
  {
    path: '/gauges/:gaugeId/settings',
    content: GaugeForm,
    left: ViewGaugeLeft,
  },
];
