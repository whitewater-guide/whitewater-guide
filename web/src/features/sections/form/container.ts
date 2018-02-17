import { compose, mapProps } from 'recompose';
import { formContainer, serializeForm } from '../../../components/forms';
import { withFeatureIds } from '../../../ww-clients/core';
import { SectionFormSchema } from '../../../ww-commons';
import deserializeSection from './deserializeSection';
import { SECTION_FORM_QUERY } from './sectionForm.query';
import UPSERT_SECTION from './upsertSection.mutation';

const sectionForm = formContainer({
  formName: 'section',
  propName: 'section',
  defaultValue: (props) => ({
    id: null,
    region: { id: props.data.region.id },
    river: { id: props.data.river.id, name: props.data.river.name },
    name: '',
    altNames: [],
  }),
  query: SECTION_FORM_QUERY,
  mutation: UPSERT_SECTION,
  serializeForm: serializeForm(['description'], ['river', 'gauge'], ['pois', 'tags']),
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
