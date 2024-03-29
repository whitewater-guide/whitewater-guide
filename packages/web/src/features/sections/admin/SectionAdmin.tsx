import Box from '@material-ui/core/Box';
import type { SectionAdminSettings } from '@whitewater-guide/schema';
import React from 'react';

import { FormikCard, useApolloFormik } from '../../../formik';
import { CheckboxField } from '../../../formik/fields';
import type { AdministrateSectionMutationVariables } from './administrateSection.generated';
import { AdministrateSectionDocument } from './administrateSection.generated';
import makeFormToMutation from './makeFormToMutation';
import queryToForm from './queryToForm';
import type {
  SectionAdminSettingsQuery,
  SectionAdminSettingsQueryVariables,
} from './sectionAdminSettings.generated';
import { SectionAdminSettingsDocument } from './sectionAdminSettings.generated';
import type { RouterParams } from './types';

interface Props {
  match: {
    params: RouterParams;
  };
}

const SectionAdmin: React.FC<Props> = ({ match }) => {
  const formToMutation = makeFormToMutation(match.params.sectionId);

  const formik = useApolloFormik<
    SectionAdminSettingsQueryVariables,
    SectionAdminSettingsQuery,
    SectionAdminSettings,
    AdministrateSectionMutationVariables
  >({
    query: SectionAdminSettingsDocument,
    queryOptions: {
      variables: { sectionId: match.params.sectionId },
    },
    queryToForm,
    mutation: AdministrateSectionDocument,
    formToMutation,
  });

  return (
    <FormikCard header="Admin settings" submitLabel="Update" {...formik}>
      <Box padding={1}>
        <CheckboxField
          name="demo"
          label="Demo section (free in premium region)"
        />
      </Box>
    </FormikCard>
  );
};

export default SectionAdmin;
