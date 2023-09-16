import qs from 'qs';
import React, { useMemo } from 'react';
import type { RouteComponentProps } from 'react-router';

import { HashTabs, HashTabView } from '../../../components/navtabs';
import { FormikCard, useApolloFormik } from '../../../formik';
import { MarkdownField, POIArray } from '../../../formik/fields';
import { FormikTab } from '../../../formik/helpers';
import addToList from './addToList';
import formToMutation from './formToMutation';
import makeQueryToForm from './makeQueryToForm';
import type {
  SectionFormQuery,
  SectionFormQueryVariables,
} from './sectionForm.generated';
import { SectionFormDocument } from './sectionForm.generated';
import { SectionFormFlows } from './SectionFormFlows';
import SectionFormLicense from './SectionFormLicense';
import { SectionFormMain } from './SectionFormMain';
import { SectionFormMap } from './SectionFormMap';
import SectionFormMedia from './SectionFormMedia';
import { SectionFormProperties } from './SectionFormProperties';
import type { RouterParams, SectionFormData } from './types';
import type { UpsertSectionMutationVariables } from './upsertSection.generated';
import { UpsertSectionDocument } from './upsertSection.generated';
import { SectionFormSchema } from './validation';

const header = { resourceType: 'section' };

const MainFields: Array<keyof SectionFormData> = [
  'name',
  'altNames',
  'difficulty',
  'difficultyXtra',
  'rating',
];
const FlowsFields: Array<keyof SectionFormData> = [
  'gauge',
  'levels',
  'flows',
  'flowsText',
];
const PropertiesFields: Array<keyof SectionFormData> = [
  'drop',
  'distance',
  'duration',
  'season',
  'seasonNumeric',
  'supplyTags',
  'kayakingTags',
  'hazardsTags',
  'miscTags',
];
const ShapeFields: Array<keyof SectionFormData> = ['shape'];
const POIFields: Array<keyof SectionFormData> = ['pois'];
const DescriptionFields: Array<keyof SectionFormData> = ['description'];
const MediaFields: Array<keyof SectionFormData> = ['media'];
const LicenseFields: Array<keyof SectionFormData> = ['license', 'copyright'];

type Props = RouteComponentProps<RouterParams>;

const SectionForm: React.FC<Props> = ({ match, location }) => {
  const query = qs.parse(location.search.substr(1));
  const { regionId, sectionId } = match.params;
  const riverId = query.riverId as string;
  const copyFromId = query.copy as string;
  const queryToForm = useMemo(
    () => makeQueryToForm(!!copyFromId),
    [copyFromId],
  );

  const formik = useApolloFormik<
    SectionFormQueryVariables,
    SectionFormQuery,
    SectionFormData,
    UpsertSectionMutationVariables
  >({
    query: SectionFormDocument,
    queryOptions: {
      variables: {
        regionId,
        riverId,
        sectionId: sectionId || copyFromId,
      },
    },
    queryToForm,
    mutation: UpsertSectionDocument,
    formToMutation,
    mutationOptions: {
      update: addToList(match.params),
    },
  });

  const region = formik.rawData ? formik.rawData.region : null;
  const gauges = formik.rawData ? formik.rawData.gauges : null;
  const tags = formik.rawData ? formik.rawData.tags : [];
  const needsVerification =
    !formik.rawData?.section?.verified && !!formik.rawData?.section?.id;

  return (
    <FormikCard<SectionFormQuery, SectionFormData>
      header={header}
      {...formik}
      validationSchema={SectionFormSchema}
      submitLabel={needsVerification ? 'Verify and save' : undefined}
      validateOnChange={false}
    >
      <HashTabs variant="scrollable">
        <FormikTab fields={MainFields} label="Basic" value="#main" />
        <FormikTab fields={FlowsFields} label="Flows" value="#flows" />
        <FormikTab fields={ShapeFields} label="Shape" value="#shape" />
        <FormikTab
          fields={PropertiesFields}
          label="Properties"
          value="#properties"
        />
        <FormikTab
          fields={DescriptionFields}
          label="Description"
          value="#description"
        />
        <FormikTab fields={POIFields} label="POIS" value="#pois" />
        <FormikTab fields={MediaFields} label="Media" value="#media" />
        <FormikTab fields={LicenseFields} label="Licensing" value="#license" />
      </HashTabs>

      <HashTabView value="#main">
        <SectionFormMain />
      </HashTabView>

      <HashTabView value="#flows">
        <SectionFormFlows gauges={gauges} />
      </HashTabView>

      <HashTabView value="#properties">
        <SectionFormProperties tags={tags} />
      </HashTabView>

      <HashTabView value="#shape" display="flex" flexDirection="row">
        <SectionFormMap bounds={region?.bounds ?? null} />
      </HashTabView>

      <HashTabView value="#description" padding={0}>
        <MarkdownField name="description" />
      </HashTabView>

      <HashTabView value="#pois">
        <POIArray name="pois" mapBounds={region?.bounds ?? null} />
      </HashTabView>

      <HashTabView value="#media">
        <SectionFormMedia />
      </HashTabView>

      <HashTabView value="#license">
        <SectionFormLicense regionLicense={region?.license} />
      </HashTabView>
    </FormikCard>
  );
};

SectionForm.displayName = 'SectionForm';

export default SectionForm;
