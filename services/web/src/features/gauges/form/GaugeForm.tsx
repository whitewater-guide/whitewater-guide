import React, { useMemo } from 'react';
import { FormikCard, useApolloFormik } from '../../../formik';
import formToMutation from './formToMutation';
import { GAUGE_FORM_QUERY, QResult, QVars } from './gaugeForm.query';
import GaugeFormMain from './GaugeFormMain';
import makeQueryToForm from './makeQueryToForm';
import { GaugeFormData, RouterParams } from './types';
import { MVars, UPSERT_GAUGE } from './upsertGauge.mutation';
import { GaugeFormSchema } from './validation';

const header = { resourceType: 'gauge' };

interface Props {
  match: {
    params: RouterParams;
  };
}

const GaugeForm: React.FC<Props> = ({ match }) => {
  const queryToForm = useMemo(() => makeQueryToForm(match.params), [
    match.params,
  ]);

  const formik = useApolloFormik<QVars, QResult, GaugeFormData, MVars>({
    query: GAUGE_FORM_QUERY,
    queryOptions: {
      variables: { gaugeId: match.params.gaugeId },
    },
    queryToForm,
    mutation: UPSERT_GAUGE,
    formToMutation,
  });

  return (
    <FormikCard<QResult, GaugeFormData>
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
