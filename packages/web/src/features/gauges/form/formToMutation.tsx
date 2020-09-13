import { toJSON } from '../../../formik/utils';
import { GaugeFormData } from './types';
import { MVars } from './upsertGauge.mutation';

export default (gauge: GaugeFormData): MVars => ({
  gauge: {
    ...gauge,
    location: gauge.location
      ? {
          id: null,
          kind: 'gauge',
          name: null,
          description: null,
          ...gauge.location,
        }
      : null,
    requestParams: toJSON(gauge.requestParams),
  },
});
