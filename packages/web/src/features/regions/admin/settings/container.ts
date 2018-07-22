import { withRouter } from 'react-router';
import { compose } from 'recompose';
import { InjectedFormProps } from 'redux-form';
import { deserializeForm, formContainer, serializeForm } from '../../../../components/forms';
import { withFeatureIds } from '../../../../ww-clients/core';
import { RegionAdminSettings, RegionAdminSettingsSchema } from '../../../../ww-commons';
import ADMINISTRATE_REGION_MUTATION from './administrateRegion.mutation';
import { REGION_ADMIN_SETTINGS_QUERY } from './regionAdmin.query';

const regionAdminForm = formContainer({
  formName: 'regionAdminSettings',
  propName: 'settings',
  defaultValue: {},
  query: REGION_ADMIN_SETTINGS_QUERY,
  mutation: ADMINISTRATE_REGION_MUTATION,
  serializeForm: serializeForm(),
  deserializeForm: deserializeForm([], ['banners', 'coverImage']),
  validationSchema: RegionAdminSettingsSchema,
  backPath: null,
});

export default compose<InjectedFormProps<RegionAdminSettings>, {}>(
  withRouter,
  withFeatureIds('region'),
  regionAdminForm,
);
