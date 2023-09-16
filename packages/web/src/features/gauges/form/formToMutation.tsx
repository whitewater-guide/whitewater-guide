import { toJSON } from '../../../formik/utils';
import type { GaugeFormData } from './types';
import type { UpsertGaugeMutationVariables } from './upsertGauge.generated';

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
