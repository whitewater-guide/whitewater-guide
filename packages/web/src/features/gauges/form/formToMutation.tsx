import { toJSON } from '../../../formik/utils';
import { GaugeFormData } from './types';
import { UpsertGaugeMutationVariables } from './upsertGauge.generated';

export default (gauge: GaugeFormData): UpsertGaugeMutationVariables => ({
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
    timezone: gauge.timezone?.id ?? null,
    requestParams: toJSON(gauge.requestParams),
  },
});
