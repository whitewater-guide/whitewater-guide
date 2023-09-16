import Box from '@material-ui/core/Box';
import type { RiverInput } from '@whitewater-guide/schema';
import { RiverInputSchema } from '@whitewater-guide/schema';
import React from 'react';

import { FormikCard, useApolloFormik } from '../../../formik';
import { MultiTextField, TextField } from '../../../formik/fields';
import formToMutation from './formToMutation';
import makeQueryToForm from './makeQueryToForm';
import type {
  RiverFormQuery,
  RiverFormQueryVariables,
} from './riverForm.generated';
import { RiverFormDocument } from './riverForm.generated';
import type { RouterParams } from './types';
import type { UpsertRiverMutationVariables } from './upsertRiver.generated';
import { UpsertRiverDocument } from './upsertRiver.generated';

const header = { resourceType: 'river' };

interface Props {
  match: {
    params: RouterParams;
  };
}

const RiverForm: React.FC<Props> = ({ match }) => {
  const queryToForm = makeQueryToForm(match.params.regionId);

  const formik = useApolloFormik<
    RiverFormQueryVariables,
    RiverFormQuery,
    RiverInput,
    UpsertRiverMutationVariables
  >({
    query: RiverFormDocument,
    queryOptions: {
      variables: { riverId: match.params.riverId },
    },
    queryToForm,
    mutation: UpsertRiverDocument,
    formToMutation,
  });

  return (
    <FormikCard header={header} {...formik} validationSchema={RiverInputSchema}>
      <Box padding={1}>
        <TextField fullWidth name="name" label="Name" placeholder="Name" />
        <MultiTextField fullWidth name="altNames" label="Alternative names" />
      </Box>
    </FormikCard>
  );
};

RiverForm.displayName = 'RiverForm';

export default RiverForm;
