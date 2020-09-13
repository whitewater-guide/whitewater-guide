import React from 'react';

import { FormikCard, useApolloFormik } from '../../../formik';
import { squashConnection } from '../../../formik/utils';
import { BANNER_FORM_QUERY, QResult, QVars } from './bannerForm.query';
import { BannerFormMain } from './BannerFormMain';
import formToMutation from './formToMutation';
import queryToForm from './queryToForm';
import { BannerFormData } from './types';
import { MVars, UPSERT_BANNER } from './upsertBanner.mutation';
import { BannerFormSchema } from './validation';

const header = { resourceType: 'banner' };

interface Props {
  match: { params: { bannerId?: string } };
}

export const BannerForm: React.FC<Props> = ({ match }) => {
  const formik = useApolloFormik<QVars, QResult, BannerFormData, MVars>({
    query: BANNER_FORM_QUERY,
    queryOptions: {
      variables: { bannerId: match.params.bannerId },
    },
    queryToForm,
    mutation: UPSERT_BANNER,
    formToMutation,
  });

  const regions = squashConnection(formik.rawData, 'regions');
  const groups = squashConnection(formik.rawData, 'groups');

  return (
    <FormikCard<QResult, BannerFormData>
      header={header}
      {...formik}
      validationSchema={BannerFormSchema}
      validateOnChange={true}
    >
      <BannerFormMain regions={regions} groups={groups} />
    </FormikCard>
  );
};

BannerForm.displayName = 'BannerForm';
