import { compose } from 'recompose';
import { formContainer } from '../../../components/forms';
import { withFeatureIds } from '../../../ww-clients/core';
import { RIVER_DETAILS } from '../../../ww-clients/features/rivers';
import { RiverInputSchema } from '../../../ww-commons';
import deserializeRiver from './deserializeRiver';
import serializeRiver from './serializeRiver';
import UPSERT_RIVER from './upsertRiver.mutation';

const riverForm = formContainer({
  formName: 'river',
  propName: 'river',
  defaultValue: (props) => ({
    id: null,
    region: { id: props.regionId },
    name: '',
    altNames: [],
  }),
  query: RIVER_DETAILS,
  mutation: UPSERT_RIVER,
  serializeForm: serializeRiver,
  deserializeForm: deserializeRiver,
  validationSchema: RiverInputSchema,
});

export default compose(
  withFeatureIds(['region', 'river']),
  riverForm,
);
