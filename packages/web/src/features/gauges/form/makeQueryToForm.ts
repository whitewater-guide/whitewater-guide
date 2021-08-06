import { fromJSON } from '../../../formik/utils';
import { GaugeFormQuery } from './gaugeForm.generated';
import { GaugeFormData, RouterParams } from './types';

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
      };
    }
    return {
      ...result.gauge,
      source: { id: sourceId },
      requestParams: fromJSON(result.gauge.requestParams),
      location: result.gauge.location
        ? { ...result.gauge.location, name: null, description: null }
        : null,
    };
  };
