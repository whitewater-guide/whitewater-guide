import React from 'react';
import { HashTabs, HashTabView } from '../../../components/navtabs';
import { FormikCard, useApolloFormik } from '../../../formik';
import { DrawingMapField, MarkdownField } from '../../../formik/fields';
import { FormikTab } from '../../../formik/helpers';
import formToMutation from './formToMutation';
import queryToForm from './queryToForm';
import { QResult, QVars, REGION_FORM_QUERY } from './regionForm.queue';
import RegionFormMain from './RegionFormMain';
import RegionFormPOIs from './RegionFormPOIs';
import { RegionFormData, RouterParams } from './types';
import { MVars, UPSERT_REGION } from './upsertRegion.mutation';
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

interface Props {
  match: {
    params: RouterParams;
  };
}

const RegionForm: React.FC<Props> = ({ match }) => {
  const formik = useApolloFormik<QVars, QResult, RegionFormData, MVars>({
    query: REGION_FORM_QUERY,
    queryOptions: {
      variables: { regionId: match.params.regionId },
    },
    queryToForm,
    mutation: UPSERT_REGION,
    formToMutation,
  });

  return (
    <FormikCard<QResult, RegionFormData>
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
    </FormikCard>
  );
};

RegionForm.displayName = 'RegionForm';

export default RegionForm;
