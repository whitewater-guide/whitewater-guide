import { deserializeForm, formContainer, serializeForm } from '../../../components/forms';
import { GAUGE_DETAILS } from '../../../ww-clients/features/gauges';
import { GaugeInputSchema } from '../../../ww-commons';
import UPSERT_GAUGE from './upsertGauge.mutation';

const gaugeForm = formContainer({
  formName: 'gauge',
  propName: 'gauge',
  backPath: '/gauges',
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
  serializeForm: serializeForm(),
  deserializeForm: deserializeForm(),
  validationSchema: GaugeInputSchema,
});

export default gaugeForm;
