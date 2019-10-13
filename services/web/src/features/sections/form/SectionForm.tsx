import qs from 'qs';
import React, { useMemo } from 'react';
import { RouteComponentProps } from 'react-router';
import { HashTabs, HashTabView } from '../../../components/navtabs';
import { FormikCard, useApolloFormik } from '../../../formik';
import { MarkdownField, POIArray } from '../../../formik/fields';
import { FormikTab } from '../../../formik/helpers';
import addToList from './addToList';
import formToMutation from './formToMutation';
import makeQueryToForm from './makeQueryToForm';
import RejectSuggestedButton from './RejectSuggestedButton';
import { QResult, QVars, SECTION_FORM_QUERY } from './sectionForm.query';
import { SectionFormFlows } from './SectionFormFlows';
import { SectionFormMain } from './SectionFormMain';
import { SectionFormMap } from './SectionFormMap';
import { SectionFormProperties } from './SectionFormProperties';
import { RouterParams, SectionFormData } from './types';
import { MVars, UPSERT_SECTION } from './upsertSection.mutation';
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

type Props = RouteComponentProps<RouterParams>;

const SectionForm: React.FC<Props> = ({ match, location }) => {
  const query = qs.parse(location.search.substr(1));
  const { regionId, sectionId } = match.params;
  const riverId = query.riverId;
  const copyFromId = query.copy;
  const fromSuggestedId = query.fromSuggestedId;
  const queryToForm = useMemo(() => makeQueryToForm(!!copyFromId), [
    copyFromId,
  ]);

  const formik = useApolloFormik<QVars, QResult, SectionFormData, MVars>({
    query: SECTION_FORM_QUERY,
    queryOptions: {
      variables: {
        regionId,
        riverId,
        fromSuggestedId,
        sectionId: sectionId || copyFromId,
      },
    },
    queryToForm,
    mutation: UPSERT_SECTION,
    formToMutation,
    mutationOptions: {
      update: addToList(match.params),
    },
  });

  const region = formik.rawData ? formik.rawData.region : null;
  const gauges = formik.rawData ? formik.rawData.gauges : null;
  const bounds = region ? region.bounds : null;
  const tags = formik.rawData ? formik.rawData.tags : [];

  return (
    <FormikCard<QResult, SectionFormData>
      header={fromSuggestedId ? 'Suggested section' : header}
      {...formik}
      validationSchema={SectionFormSchema}
      submitLabel={fromSuggestedId ? 'Accept' : undefined}
      validateOnChange={false}
      extraActions={
        <RejectSuggestedButton suggestedSectionId={fromSuggestedId} />
      }
    >
      <HashTabs variant="fullWidth">
        <FormikTab fields={MainFields} label="Basic" value="#main" />
        <FormikTab fields={FlowsFields} label="Flows" value="#flows" />
        <FormikTab fields={ShapeFields} label="Shape" value="#shape" />
        <FormikTab
          fields={PropertiesFields}
          label="Properties"
          value="#properties"
        />
        <FormikTab fields={POIFields} label="POIS" value="#pois" />
        <FormikTab
          fields={DescriptionFields}
          label="Description"
          value="#description"
        />
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
        <SectionFormMap bounds={bounds} />
      </HashTabView>

      <HashTabView value="#pois">
        <POIArray name="pois" mapBounds={bounds} />
      </HashTabView>

      <HashTabView value="#description" padding={0}>
        <MarkdownField name="description" />
      </HashTabView>
    </FormikCard>
  );
};

SectionForm.displayName = 'SectionForm';

export default SectionForm;
