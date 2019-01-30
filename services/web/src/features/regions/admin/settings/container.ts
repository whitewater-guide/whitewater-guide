import { withFeatureIds } from '@whitewater-guide/clients';
import {
  RegionAdminSettings,
  RegionAdminSettingsStruct,
} from '@whitewater-guide/commons';
import { withRouter } from 'react-router';
import { compose } from 'recompose';
import { InjectedFormProps } from 'redux-form';
import {
  deserializeForm,
  formContainer,
  serializeForm,
} from '../../../../components/forms';
import ADMINISTRATE_REGION_MUTATION from './administrateRegion.mutation';
import { REGION_ADMIN_SETTINGS_QUERY } from './regionAdmin.query';

const regionAdminForm = formContainer({
  formName: 'regionAdminSettings',
  propName: 'settings',
  defaultValue: {},
  query: REGION_ADMIN_SETTINGS_QUERY,
  mutation: ADMINISTRATE_REGION_MUTATION,
  serializeForm: serializeForm(),
  deserializeForm: deserializeForm([], ['coverImage']),
  validationSchema: RegionAdminSettingsStruct,
  backPath: null,
});

export default compose<InjectedFormProps<RegionAdminSettings>, {}>(
  withRouter,
  withFeatureIds('region'),
  regionAdminForm,
);
