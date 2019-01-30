import { RIVER_DETAILS, withFeatureIds } from '@whitewater-guide/clients';
import { RiverInput, RiverInputStruct } from '@whitewater-guide/commons';
import { compose } from 'recompose';
import { InjectedFormProps } from 'redux-form';
import { formContainer } from '../../../components/forms';
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
  validationSchema: RiverInputStruct,
});

export default compose<InjectedFormProps<RiverInput>, {}>(
  withFeatureIds(['region', 'river']),
  riverForm,
);
