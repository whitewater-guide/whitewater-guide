import React from 'react';

import { HashTabs, HashTabView } from '../../../components/navtabs';
import { FormikCard, useApolloFormik } from '../../../formik';
import { DrawingMapField, MarkdownField } from '../../../formik/fields';
import { FormikTab } from '../../../formik/helpers';
import formToMutation from './formToMutation';
import queryToForm from './queryToForm';
import type {
  RegionFormQuery,
  RegionFormQueryVariables,
} from './regionForm.generated';
import { RegionFormDocument } from './regionForm.generated';
import RegionFormLicense from './RegionFormLicense';
import RegionFormMain from './RegionFormMain';
import RegionFormPOIs from './RegionFormPOIs';
import type { RegionFormData, RouterParams } from './types';
import type { UpsertRegionMutationVariables } from './upsertRegion.generated';
import { UpsertRegionDocument } from './upsertRegion.generated';
import { RegionFormSchema } from './validation';

const header = { resourceType: 'region' };

const MainFields: Array<keyof RegionFormData> = [
  'name',
  'season',
  'seasonNumeric',
];
const DescriptionFields: Array<keyof RegionFormData> = ['description'];
const BoundsFields: Array<keyof RegionFormData> = ['bounds'];
const PoisFields: Array<keyof RegionFormData> = ['pois'];
const LicenseFields: Array<keyof RegionFormData> = ['license', 'copyright'];

interface Props {
  match: {
    params: RouterParams;
  };
}

const RegionForm: React.FC<Props> = ({ match }) => {
  const formik = useApolloFormik<
    RegionFormQueryVariables,
    RegionFormQuery,
    RegionFormData,
    UpsertRegionMutationVariables
  >({
    query: RegionFormDocument,
    queryOptions: {
      variables: { regionId: match.params.regionId },
    },
    queryToForm,
    mutation: UpsertRegionDocument,
    formToMutation,
  });

  return (
    <FormikCard<RegionFormQuery, RegionFormData>
      header={header}
      {...formik}
      validationSchema={RegionFormSchema}
    >
      <HashTabs variant="fullWidth">
        <FormikTab fields={MainFields} label="Main" value="#main" />
        <FormikTab
          fields={DescriptionFields}
          label="Description"
          value="#description"
        />
        <FormikTab fields={BoundsFields} label="Shape" value="#shape" />
        <FormikTab fields={PoisFields} label="POIS" value="#pois" />
        <FormikTab fields={LicenseFields} label="Licensing" value="#license" />
      </HashTabs>

      <HashTabView value="#main">
        <RegionFormMain />
      </HashTabView>

      <HashTabView value="#description" padding={0}>
        <MarkdownField name="description" />
      </HashTabView>

      <HashTabView value="#shape" padding={0}>
        <DrawingMapField name="bounds" drawingMode="Polygon" bounds={null} />
      </HashTabView>

      <HashTabView value="#pois" padding={0}>
        <RegionFormPOIs />
      </HashTabView>

      <HashTabView value="#license">
        <RegionFormLicense />
      </HashTabView>
    </FormikCard>
  );
};

RegionForm.displayName = 'RegionForm';

export default RegionForm;
