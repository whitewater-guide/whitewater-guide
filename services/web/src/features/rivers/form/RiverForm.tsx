import Box from '@material-ui/core/Box';
import { RiverInput, RiverInputSchema } from '@whitewater-guide/commons';
import React from 'react';
import { FormikCard, useApolloFormik } from '../../../formik';
import { MultiTextField, TextField } from '../../../formik/fields';
import formToMutation from './formToMutation';
import makeQueryToForm from './makeQueryToForm';
import { QResult, QVars, RIVER_FORM_QUERY } from './riverForm.query';
import { RouterParams } from './types';
import { MVars, UPSERT_RIVER } from './upsertRiver.mutation';

const header = { resourceType: 'river' };

interface Props {
  match: {
    params: RouterParams;
  };
}

const RiverForm: React.FC<Props> = ({ match }) => {
  const queryToForm = makeQueryToForm(match.params.regionId);

  const formik = useApolloFormik<QVars, QResult, RiverInput, MVars>({
    query: RIVER_FORM_QUERY,
    queryOptions: {
      variables: { riverId: match.params.riverId },
    },
    queryToForm,
    mutation: UPSERT_RIVER,
    formToMutation,
  });

  return (
    <FormikCard header={header} {...formik} validationSchema={RiverInputSchema}>
      <Box padding={1}>
        <TextField
          fullWidth={true}
          name="name"
          label="Name"
          placeholder="Name"
        />
        <MultiTextField
          fullWidth={true}
          name="altNames"
          label="Alternative names"
        />
      </Box>
    </FormikCard>
  );
};

RiverForm.displayName = 'RiverForm';

export default RiverForm;
