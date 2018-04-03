import { withRouter } from 'react-router';
import { compose } from 'recompose';
import { formContainer, serializeForm } from '../../../../components/forms';
import { withFeatureIds } from '../../../../ww-clients/core';
import { Region, RegionAdminSettingsSchema } from '../../../../ww-commons';
import ADMINISTRATE_REGION_MUTATION from './administrateRegion.mutation';
import REGION_ADMIN_SETTINGS_QUERY from './regionAdmin.query';

const regionAdminForm = formContainer({
  formName: 'regionAdminSettings',
  propName: 'settings',
  defaultValue: {},
  query: REGION_ADMIN_SETTINGS_QUERY,
  mutation: ADMINISTRATE_REGION_MUTATION,
  serializeForm: serializeForm(),
  deserializeForm: ({ hidden, premium }: Region) => ({ hidden, premium }),
  validationSchema: RegionAdminSettingsSchema,
  extraVariables: ({ regionId }) => ({ regionId }),
  backPath: null,
});

export default compose(
  withRouter,
  withFeatureIds('region'),
  regionAdminForm,
);
