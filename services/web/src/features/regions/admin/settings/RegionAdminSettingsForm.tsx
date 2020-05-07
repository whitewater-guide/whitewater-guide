import {
  ADMINISTRATE_REGION_MUTATION,
  MVars,
} from './administrateRegion.mutation';
import {
  QResult,
  QVars,
  REGION_ADMIN_SETTINGS_QUERY,
} from './regionAdmin.query';
import React, { useMemo } from 'react';

import { CardContent } from '../../../../layout';
import { Formik } from 'formik';
import { Loading } from '../../../../components';
import { RegionAdminFormData } from './types';
import { RegionAdminFormSchema } from './validation';
import RegionAdminSettingsFooter from './RegionAdminSettingsFooter';
import RegionAdminSettingsMain from './RegionAdminSettingsMain';
import { UnsavedPrompt } from '../../../../formik/helpers';
import { createSafeValidator } from '@whitewater-guide/validation';
import formToMutation from './formToMutation';
import queryToForm from './queryToForm';
import { useApolloFormik } from '../../../../formik';

interface Props {
  regionId: string;
}

export const RegionAdminSettingsForm: React.FC<Props> = React.memo(
  ({ regionId }) => {
    const validate: any = useMemo(
      () => createSafeValidator(RegionAdminFormSchema),
      [],
    );

    const formik = useApolloFormik<QVars, QResult, RegionAdminFormData, MVars>({
      query: REGION_ADMIN_SETTINGS_QUERY,
      queryOptions: {
        variables: { regionId },
      },
      queryToForm,
      mutation: ADMINISTRATE_REGION_MUTATION,
      formToMutation,
    });

    if (formik.loading || !formik.initialValues) {
      return (
        <CardContent>
          <Loading />
        </CardContent>
      );
    }

    return (
      <Formik<RegionAdminFormData>
        initialValues={formik.initialValues}
        onSubmit={formik.onSubmit}
        validate={validate}
      >
        <React.Fragment>
          <UnsavedPrompt />
          <RegionAdminSettingsMain />
          <RegionAdminSettingsFooter />
        </React.Fragment>
      </Formik>
    );
  },
);

RegionAdminSettingsForm.displayName = 'RegionAdminSettingsForm';
