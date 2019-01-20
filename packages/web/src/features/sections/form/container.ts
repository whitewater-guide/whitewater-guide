import { MutationUpdaterFn } from 'apollo-client';
import { compose, mapProps } from 'recompose';
import { formContainer, MdEditorStruct } from '../../../components/forms';
import { withFeatureIds } from '../../../ww-clients/core';
import { LIST_SECTIONS, WithSectionsList } from '../../../ww-clients/features/sections';
import { SectionFormStruct } from '../../../ww-commons';
import deserializeSection from './deserializeSection';
import { SECTION_FORM_QUERY } from './sectionForm.query';
import serializeSection from './serializeSection';
import { SectionFormProps } from './types';
import { UPSERT_SECTION, UpsertSectionResult } from './upsertSection.mutation';

const addToList = ({ regionId }: any): MutationUpdaterFn<UpsertSectionResult> => (store, result) => {
  const section = result.data && result.data.upsertSection;
  if (!section) {
    return;
  }
  const queryResult: WithSectionsList | null =
    store.readQuery({ query: LIST_SECTIONS, variables: { filter: { regionId } } });
  if (!queryResult) {
    return;
  }
  const { sections } = queryResult;
  const isNew = sections.nodes.findIndex(s => s.id === section.id) === -1;
  if (!isNew) {
    return;
  }
  sections.count += 1;
  sections.nodes.push(section);
  store.writeQuery({ query: LIST_SECTIONS, variables: { filter: { regionId } }, data: queryResult });
};

const sectionForm = formContainer({
  formName: 'section',
  propName: 'section',
  defaultValue: (props) => ({
    id: null,
    river: { id: props.data.river.id, name: props.data.river.name },
    name: '',
    altNames: [],
    season: null,
    seasonNumeric: [],
    gauge: null,
    flowsText: null,
    shape: null,
    distance: null,
    drop: null,
    duration: null,
    difficulty: null,
    difficultyXtra: null,
    rating: null,
    tags: [],
    pois: [],
    description: null,
    hidden: false,
  }),
  query: SECTION_FORM_QUERY,
  mutation: UPSERT_SECTION,
  serializeForm: serializeSection,
  deserializeForm: deserializeSection,
  validationSchema: SectionFormStruct(MdEditorStruct),
  mutationOptions: (props) => ({
    update: addToList(props),
  }),
});

export default compose<SectionFormProps, {}>(
  withFeatureIds(['region', 'river', 'section']),
  sectionForm,
  mapProps(({ data, ...props }: any) => ({
    region: data.region,
    river: data.river,
    tags: data.tags,
    ...props,
  })),
);
