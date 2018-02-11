import { compose } from 'recompose';
import { formContainer } from '../../../components/forms';
import { withFeatureIds } from '../../../ww-clients/core';
import { SECTION_DETAILS } from '../../../ww-clients/features/sections';
import { SectionInputSchema } from '../../../ww-commons';
import deserializeSection from './deserializeSection';
import serializeSection from './serializeSection';
import UPSERT_SECTION from './upsertSection.mutation';

const sectionForm = formContainer({
  formName: 'section',
  propName: 'section',
  defaultValue: (props) => ({
    id: null,
    region: { id: props.regionId },
    name: '',
    altNames: [],
  }),
  query: SECTION_DETAILS,
  mutation: UPSERT_SECTION,
  serializeForm: serializeSection,
  deserializeForm: deserializeSection,
  validationSchema: SectionInputSchema,
});

export default compose(
  withFeatureIds(['region', 'section']),
  sectionForm,
);
