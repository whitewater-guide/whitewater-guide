import { withRouter } from 'react-router';
import { compose } from 'recompose';
import { formContainer, serializeForm } from '../../../../components/forms';
import { withFeatureIds } from '../../../../ww-clients/core';
import { Section, SectionAdminSettingsSchema } from '../../../../ww-commons';
import ADMINISTRATE_SECTION_MUTATION from './administrateSection.mutation';
import SECTION_ADMIN_SETTINGS_QUERY from './sectionAdmin.query';

const sectionAdminForm = formContainer({
  formName: 'sectionAdminSettings',
  propName: 'settings',
  defaultValue: {},
  query: SECTION_ADMIN_SETTINGS_QUERY,
  mutation: ADMINISTRATE_SECTION_MUTATION,
  serializeForm: serializeForm(),
  deserializeForm: ({ demo }: Section) => ({ demo }),
  validationSchema: SectionAdminSettingsSchema,
  extraVariables: ({ sectionId }) => ({ sectionId }),
  backPath: null,
});

export default compose(
  withRouter,
  withFeatureIds('section'),
  sectionAdminForm,
);