import { fromJSON } from '../../../formik/utils';
import type { GaugeFormQuery } from './gaugeForm.generated';
import type { GaugeFormData, RouterParams } from './types';

export default ({ sourceId }: RouterParams) =>
  (result: GaugeFormQuery): GaugeFormData => {
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
        url: null,
        timezone: null,
      };
    }
    return {
      ...result.gauge,
      source: { id: sourceId },
      requestParams: fromJSON(result.gauge.requestParams),
      timezone: result.gauge.timezone
        ? { id: result.gauge.timezone, name: result.gauge.timezone }
        : null,
      location: result.gauge.location
        ? { ...result.gauge.location, name: null, description: null }
        : null,
    };
  };
