import { LogbookDescentInputSchema } from '@whitewater-guide/logbook-schema';
import React from 'react';
import { FormikCard, useApolloFormik } from '../../../formik';
import { DESCENT_FORM_QUERY, QResult, QVars } from './descentForm.query';
import DescentFormMain from './DescentFormMain';
import formToMutation from './formToMutation';
import queryToForm from './queryToForm';
import { DescentFormData, RouterParams } from './types';
import { MVars, UPSERT_DESCENT } from './upsertDescent.mutation';

const header = { resourceType: 'descent' };

interface Props {
  match: {
    params: RouterParams;
  };
}

const DescentForm: React.FC<Props> = ({ match }) => {
  const formik = useApolloFormik<QVars, QResult, DescentFormData, MVars>({
    query: DESCENT_FORM_QUERY,
    queryOptions: {
      variables: { descentId: match.params.descentId },
    },
    queryToForm,
    mutation: UPSERT_DESCENT,
    formToMutation,
  });

  return (
    <FormikCard<QResult, DescentFormData>
      header={header}
      {...formik}
      validationSchema={LogbookDescentInputSchema}
    >
      <DescentFormMain />
    </FormikCard>
  );
};

export default DescentForm;
