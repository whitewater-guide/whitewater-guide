import { compose, mapProps } from 'recompose';
import { formContainer } from '../../../components/forms';
import { withFeatureIds } from '../../../ww-clients/core';
import { HarvestMode, SourceFormSchema, SourceInput } from '../../../ww-commons';
import deserializeSourceForm from './deserializeSourceForm';
import serializeSourceForm from './serializeSourceForm';
import SOURCE_FORM_QUERY from './sourceForm.query';
import UPSERT_SOURCE from './upsertSource.mutation';

const NEW_SOURCE: SourceInput = {
  id: null,
  name: '',
  termsOfUse: null,
  script: 'one_by_one',
  cron: null,
  harvestMode: HarvestMode.ONE_BY_ONE,
  url: null,
  regions: [],
};

const sourceForm = formContainer({
  formName: 'source',
  propName: 'source',
  defaultValue: NEW_SOURCE,
  query: SOURCE_FORM_QUERY,
  mutation: UPSERT_SOURCE,
  serializeForm: serializeSourceForm,
  deserializeForm: deserializeSourceForm,
  validationSchema: SourceFormSchema,
});

export default compose(
  withFeatureIds('source'),
  sourceForm,
  mapProps(({ data, ...props }) => ({
    regions: data.regions.nodes,
    scripts: data.scripts,
    ...props,
  })),
);
