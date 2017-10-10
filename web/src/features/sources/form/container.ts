import { graphql } from 'react-apollo';
import { deserializeForm, formContainer, serializeForm } from '../../../components/forms';
import { withSource } from '../../../ww-clients/features/sources';
import { SourceFormSchema } from '../../../ww-commons';
import UPSERT_SOURCE from './upsertSource.mutation';

const sourceForm = formContainer({
  formName: 'source',
  propName: 'source',
  backPath: '/sources',
  queryContainer: withSource({ errorOnMissingId: false, includeScripts: true }),
  mutationContainer: graphql(UPSERT_SOURCE, { alias: 'withUpsertSource' }),
  serializeForm: serializeForm(['termsOfUse']),
  deserializeForm: deserializeForm(['termsOfUse']),
  validationSchema: SourceFormSchema,
});

export default sourceForm;
