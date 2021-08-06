import { GaugeResolvers } from '~/apollo';

const latestMeasurementResolver: GaugeResolvers['latestMeasurement'] = (
  { script, code },
  _,
  { dataSources },
) => dataSources.gorge.getLatest(script, code);

export default latestMeasurementResolver;
