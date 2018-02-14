import { mapProps, compose } from 'recompose';
import { deserializeForm, formContainer, serializeForm } from '../../../components/forms';
import { withFeatureIds } from '../../../ww-clients/core';
import { SectionInputSchema } from '../../../ww-commons';
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
  serializeForm: serializeForm(['description']),
  deserializeForm: deserializeForm(['description'], ['region', 'river', 'pois']),
  validationSchema: SectionInputSchema,
});

export default compose(
  withFeatureIds(['region', 'river', 'section']),
  sectionForm,
  mapProps(({ data, ...props }) => ({
    region: data.region,
    river: data.river,
    ...props,
  })),
);
