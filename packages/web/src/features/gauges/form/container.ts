import { compose } from 'recompose';
import { formContainer } from '../../../components/forms';
import { withFeatureIds } from '../../../ww-clients/core/withFeatureIds';
import { GAUGE_DETAILS } from '../../../ww-clients/features/gauges';
import { GaugeFormSchema } from '../../../ww-commons';
import deserializeGauge from './deserializeGauge';
import serializeGauge from './serializeGauge';
import UPSERT_GAUGE from './upsertGauge.mutation';

const gaugeForm = formContainer({
  formName: 'gauge',
  propName: 'gauge',
  defaultValue: (props) => ({
    id: null,
    source: { id: props.sourceId },
    name: '',
    location: null,
    code: '',
    levelUnit: null,
    flowUnit: null,
    requestParams: null,
    cron: null,
    url: null,
  }),
  query: GAUGE_DETAILS,
  mutation: UPSERT_GAUGE,
  serializeForm: serializeGauge,
  deserializeForm: deserializeGauge,
  validationSchema: GaugeFormSchema,
});

export default compose(
  withFeatureIds(['source', 'gauge']),
  gaugeForm,
);
