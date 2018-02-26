import { compose, mapProps } from 'recompose';
import { formContainer } from '../../../components/forms';
import { withFeatureIds } from '../../../ww-clients/core';
import { SectionFormSchema } from '../../../ww-commons';
import deserializeSection from './deserializeSection';
import { SECTION_FORM_QUERY } from './sectionForm.query';
import serializeSection from './serializeSection';
import UPSERT_SECTION from './upsertSection.mutation';

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
  }),
  query: SECTION_FORM_QUERY,
  mutation: UPSERT_SECTION,
  serializeForm: serializeSection,
  deserializeForm: deserializeSection,
  validationSchema: SectionFormSchema,
});

export default compose(
  withFeatureIds(['region', 'river', 'section']),
  sectionForm,
  mapProps(({ data, ...props }) => ({
    region: data.region,
    river: data.river,
    tags: data.tags,
    ...props,
  })),
);
