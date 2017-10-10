import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import { withLoading } from '../../../components';
import { deserializeForm, formContainer, serializeForm } from '../../../components/forms';
import { withScriptsList, WithScriptsList } from '../../../ww-clients/features/scripts';
import { withSource } from '../../../ww-clients/features/sources';
import { SourceFormSchema } from '../../../ww-commons';
import UPSERT_SOURCE from './upsertSource.mutation';

const sourceForm = formContainer({
  formName: 'source',
  propName: 'source',
  backPath: '/sources',
  queryContainer: withSource({ errorOnMissingId: false }),
  mutationContainer: graphql(UPSERT_SOURCE, { alias: 'withUpsertSource' }),
  serializeForm: serializeForm(['termsOfUse']),
  deserializeForm: deserializeForm(['termsOfUse']),
  validationSchema: SourceFormSchema,
});

export default compose(
  sourceForm,
  withScriptsList,
  withLoading<WithScriptsList>(props => props.scripts.loading),
);
