import { compose } from 'recompose';
import { formContainer, serializeForm } from '../../../components/forms';
import { withFeatureIds } from '../../../ww-clients/core';
import { REGION_DETAILS } from '../../../ww-clients/features/regions';
import { RegionFormSchema, RegionInput } from '../../../ww-commons';
import deserializeRegion from './deserializeRegion';
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
  query: REGION_DETAILS,
  mutation: UPSERT_REGION,
  serializeForm: serializeForm(['description']),
  deserializeForm: deserializeRegion,
  validationSchema: RegionFormSchema,
});

export default compose(
  withFeatureIds('region'),
  regionForm,
);
