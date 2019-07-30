import { fromJSON } from '../../../formik/utils';
import { QResult } from './gaugeForm.query';
import { GaugeFormData, RouterParams } from './types';

export default ({ sourceId }: RouterParams) => (
  result: QResult,
): GaugeFormData => {
  if (!result || !result.gauge) {
    return {
      id: null,
      source: { id: sourceId },
      name: '',
      location: null,
      code: '',
      levelUnit: null,
      flowUnit: null,
      requestParams: null,
      cron: null,
      url: null,
    };
  }
  const { enabled, ...gauge } = result.gauge;
  return {
    ...gauge,
    source: { id: sourceId },
    requestParams: fromJSON(gauge.requestParams),
    location: gauge.location
      ? { ...gauge.location, name: null, description: null }
      : null,
  };
};
