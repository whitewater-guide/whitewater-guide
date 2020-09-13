import React from 'react';

import { HashTabs, HashTabView } from '../../../components/navtabs';
import { FormikCard, useApolloFormik } from '../../../formik';
import { MarkdownField } from '../../../formik/fields';
import { FormikTab } from '../../../formik/helpers';
import formToMutation from './formToMutation';
import queryToForm from './queryToForm';
import { QResult, QVars, SOURCE_FORM_QUERY } from './sourceForm.query';
import SourceFormMain from './SourceFormMain';
import { RouterParams, SourceFormData } from './types';
import { MVars, UPSERT_SOURCE } from './upsertSource.mutation';
import SourceFormSchema from './validation';

const header = { resourceType: 'source' };

const MainFields: Array<keyof SourceFormData> = [
  'name',
  'regions',
  'script',
  'url',
  'requestParams',
  'cron',
];
const TermsFields: Array<keyof SourceFormData> = ['termsOfUse'];

interface Props {
  match: {
    params: RouterParams;
  };
}

const SourceForm: React.FC<Props> = ({ match }) => {
  const formik = useApolloFormik<QVars, QResult, SourceFormData, MVars>({
    query: SOURCE_FORM_QUERY,
    queryOptions: {
      variables: { sourceId: match.params.sourceId },
    },
    queryToForm,
    mutation: UPSERT_SOURCE,
    formToMutation,
  });

  const regions =
    formik.rawData && formik.rawData.regions
      ? formik.rawData.regions.nodes || []
      : [];
  const scripts = formik.rawData ? formik.rawData.scripts : [];

  return (
    <FormikCard<QResult, SourceFormData>
      header={header}
      {...formik}
      validationSchema={SourceFormSchema}
    >
      <HashTabs variant="fullWidth">
        <FormikTab fields={MainFields} label="Main" value="#main" />
        <FormikTab fields={TermsFields} label="Terms of Use" value="#terms" />
      </HashTabs>

      <HashTabView value="#main">
        <SourceFormMain regions={regions} scripts={scripts} />
      </HashTabView>

      <HashTabView value="#terms" padding={0}>
        <MarkdownField name="termsOfUse" />
      </HashTabView>
    </FormikCard>
  );
};

SourceForm.displayName = 'SourceForm';

export default SourceForm;
