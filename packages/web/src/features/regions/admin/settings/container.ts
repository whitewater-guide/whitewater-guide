import { compose } from 'recompose';
import { formContainer, serializeForm } from '../../../../components/forms';
import { withFeatureIds } from '../../../../ww-clients/core';
import { REGION_DETAILS } from '../../../../ww-clients/features/regions';
import { Region, RegionAdminSettingsSchema } from '../../../../ww-commons';
import ADMINISTRATE_REGION_MUTATION from './administrateRegion.mutation';

const regionAdminForm = formContainer({
  formName: 'regionAdminSettings',
  propName: 'region',
  defaultValue: {},
  query: REGION_DETAILS,
  mutation: ADMINISTRATE_REGION_MUTATION,
  serializeForm: serializeForm(),
  deserializeForm: ({ hidden, premium }: Region) => ({ hidden, premium }),
  validationSchema: RegionAdminSettingsSchema,
});

export default compose(
  withFeatureIds('region'),
  regionAdminForm,
);
