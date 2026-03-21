import React from 'react';

import { HashTabs, HashTabView } from '../../../components/navtabs';
import { FormikCard, useApolloFormik } from '../../../formik';
import { MarkdownField } from '../../../formik/fields';
import { FormikTab } from '../../../formik/helpers';
import formToMutation from './formToMutation';
import queryToForm from './queryToForm';
import type {
  SourceFormQuery,
  SourceFormQueryVariables,
} from './sourceForm.generated';
import { SourceFormDocument } from './sourceForm.generated';
import SourceFormMain from './SourceFormMain';
import type { RouterParams, SourceFormData } from './types';
import type { UpsertSourceMutationVariables } from './upsertSource.generated';
import { UpsertSourceDocument } from './upsertSource.generated';
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
  const formik = useApolloFormik<
    SourceFormQueryVariables,
    SourceFormQuery,
    SourceFormData,
    UpsertSourceMutationVariables
  >({
    query: SourceFormDocument,
    queryOptions: {
      variables: { sourceId: match.params.sourceId },
    },
    queryToForm,
    mutation: UpsertSourceDocument,
    formToMutation,
  });

  const regions = formik.rawData?.regions
    ? formik.rawData.regions.nodes || []
    : [];
  const scripts = formik.rawData ? formik.rawData.scripts : [];

  return (
    <FormikCard<SourceFormQuery, SourceFormData>
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
