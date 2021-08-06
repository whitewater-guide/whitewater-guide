import React, { useMemo } from 'react';

import { FormikCard, useApolloFormik } from '../../../formik';
import formToMutation from './formToMutation';
import {
  GaugeFormDocument,
  GaugeFormQuery,
  GaugeFormQueryVariables,
} from './gaugeForm.generated';
import GaugeFormMain from './GaugeFormMain';
import makeQueryToForm from './makeQueryToForm';
import { GaugeFormData, RouterParams } from './types';
import {
  UpsertGaugeDocument,
  UpsertGaugeMutationVariables,
} from './upsertGauge.generated';
import { GaugeFormSchema } from './validation';

const header = { resourceType: 'gauge' };

interface Props {
  match: {
    params: RouterParams;
  };
}

const GaugeForm: React.FC<Props> = ({ match }) => {
  const queryToForm = useMemo(
    () => makeQueryToForm(match.params),
    [match.params],
  );

  const formik = useApolloFormik<
    GaugeFormQueryVariables,
    GaugeFormQuery,
    GaugeFormData,
    UpsertGaugeMutationVariables
  >({
    query: GaugeFormDocument,
    queryOptions: {
      variables: { gaugeId: match.params.gaugeId },
    },
    queryToForm,
    mutation: UpsertGaugeDocument,
    formToMutation,
  });

  return (
    <FormikCard<GaugeFormQuery, GaugeFormData>
      header={header}
      {...formik}
      validationSchema={GaugeFormSchema}
    >
      <GaugeFormMain />
    </FormikCard>
  );
};

GaugeForm.displayName = 'GaugeForm';

export default GaugeForm;
