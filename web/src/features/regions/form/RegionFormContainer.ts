import { reduxForm } from 'redux-form';
import { validateInput } from '../../../components/forms';
import { RegionInput, RegionInputSchema } from '../../../ww-commons';

const NEW_REGION: RegionInput = {
  id: null,
  hidden: false,
  description: null,
  bounds: [],
  seasonNumeric: [],
  season: null,
  name: '',
  pois: [],
};

export default reduxForm({
  form: 'region',
  validate: validateInput(RegionInputSchema),
  initialValues: NEW_REGION,
  onSubmit: (values => console.log(values)),
});
