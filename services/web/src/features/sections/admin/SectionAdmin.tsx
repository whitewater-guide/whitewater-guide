import Box from '@material-ui/core/Box';
import { SectionAdminSettings } from '@whitewater-guide/commons';
import React from 'react';
import { FormikCard, useApolloFormik } from '../../../formik';
import { CheckboxField } from '../../../formik/fields';
import {
  ADMINISTRATE_SECTION_MUTATION,
  MVars,
} from './administrateSection.mutation';
import makeFormToMutation from './makeFormToMutation';
import queryToForm from './queryToForm';
import { QResult, QVars, SECTION_ADMIN_QUERY } from './sectionAdmin.query';
import { RouterParams } from './types';

interface Props {
  match: {
    params: RouterParams;
  };
}

const SectionAdmin: React.FC<Props> = ({ match }) => {
  const formToMutation = makeFormToMutation(match.params.sectionId);

  const formik = useApolloFormik<QVars, QResult, SectionAdminSettings, MVars>({
    query: SECTION_ADMIN_QUERY,
    queryOptions: {
      variables: { sectionId: match.params.sectionId },
    },
    queryToForm,
    mutation: ADMINISTRATE_SECTION_MUTATION,
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
