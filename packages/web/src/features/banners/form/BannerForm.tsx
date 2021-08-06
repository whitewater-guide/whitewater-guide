import React from 'react';

import { FormikCard, useApolloFormik } from '../../../formik';
import {
  BannerFormDocument,
  BannerFormQuery,
  BannerFormQueryVariables,
} from './bannerForm.generated';
import { BannerFormMain } from './BannerFormMain';
import formToMutation from './formToMutation';
import queryToForm from './queryToForm';
import { BannerFormData } from './types';
import {
  UpsertBannerDocument,
  UpsertBannerMutationVariables,
} from './upsertBanner.generated';
import { BannerFormSchema } from './validation';

const header = { resourceType: 'banner' };

interface Props {
  match: { params: { bannerId?: string } };
}

export const BannerForm: React.FC<Props> = ({ match }) => {
  const formik = useApolloFormik<
    BannerFormQueryVariables,
    BannerFormQuery,
    BannerFormData,
    UpsertBannerMutationVariables
  >({
    query: BannerFormDocument,
    queryOptions: {
      variables: { bannerId: match.params.bannerId },
    },
    queryToForm,
    mutation: UpsertBannerDocument,
    formToMutation,
  });

  return (
    <FormikCard<BannerFormQuery, BannerFormData>
      header={header}
      {...formik}
      validationSchema={BannerFormSchema}
      validateOnChange
    >
      <BannerFormMain
        regions={formik.rawData?.regions.nodes}
        groups={formik.rawData?.groups?.nodes}
      />
    </FormikCard>
  );
};

BannerForm.displayName = 'BannerForm';
