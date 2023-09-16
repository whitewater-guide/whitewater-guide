import type { GaugeResolvers } from '../../../apollo/index';

const latestMeasurementResolver: GaugeResolvers['latestMeasurement'] = (
  { script, code },
  _,
  { dataSources },
) => dataSources.gorge.getLatest(script, code);

export default latestMeasurementResolver;
