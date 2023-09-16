import { createSafeValidator } from '@whitewater-guide/validation';
import { Formik } from 'formik';
import React, { useMemo } from 'react';

import { Loading } from '../../../../components';
import { useApolloFormik } from '../../../../formik';
import { UnsavedPrompt } from '../../../../formik/helpers';
import { CardContent } from '../../../../layout';
import type { AdministrateRegionMutationVariables } from './administrateRegion.generated';
import { AdministrateRegionDocument } from './administrateRegion.generated';
import formToMutation from './formToMutation';
import queryToForm from './queryToForm';
import type {
  RegionAdminQuery,
  RegionAdminQueryVariables,
} from './regionAdmin.generated';
import { RegionAdminDocument } from './regionAdmin.generated';
import RegionAdminSettingsFooter from './RegionAdminSettingsFooter';
import RegionAdminSettingsMain from './RegionAdminSettingsMain';
import type { RegionAdminFormData } from './types';
import { RegionAdminFormSchema } from './validation';

interface Props {
  regionId: string;
}

export const RegionAdminSettingsForm = React.memo<Props>(({ regionId }) => {
  const validate: any = useMemo(
    () => createSafeValidator(RegionAdminFormSchema),
    [],
  );

  const formik = useApolloFormik<
    RegionAdminQueryVariables,
    RegionAdminQuery,
    RegionAdminFormData,
    AdministrateRegionMutationVariables
  >({
    query: RegionAdminDocument,
    queryOptions: {
      variables: { regionId },
    },
    queryToForm,
    mutation: AdministrateRegionDocument,
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
      <>
        <UnsavedPrompt />
        <RegionAdminSettingsMain />
        <RegionAdminSettingsFooter />
      </>
    </Formik>
  );
});

RegionAdminSettingsForm.displayName = 'RegionAdminSettingsForm';
