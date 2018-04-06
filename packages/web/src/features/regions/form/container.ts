import { compose } from 'recompose';
import { deserializeForm, formContainer, serializeForm } from '../../../components/forms';
import { withFeatureIds } from '../../../ww-clients/core';
import { RegionFormSchema, RegionInput } from '../../../ww-commons';
import REGION_FORM_QUEUE from './regionForm.queue';
import UPSERT_REGION from './upsertRegion.mutation';

const NEW_REGION: RegionInput = {
  id: null,
  description: null,
  bounds: null,
  seasonNumeric: [],
  season: null,
  name: '',
  pois: [],
};

const regionForm = formContainer({
  formName: 'region',
  propName: 'region',
  defaultValue: NEW_REGION,
  query: REGION_FORM_QUEUE,
  mutation: UPSERT_REGION,
  serializeForm: serializeForm(['description']),
  deserializeForm: deserializeForm(['description'], ['pois']),
  validationSchema: RegionFormSchema,
});

export default compose(
  withFeatureIds('region'),
  regionForm,
);
