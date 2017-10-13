import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import { withLoading } from '../../../components';
import { deserializeForm, formContainer, serializeForm } from '../../../components/forms';
import { withRegionsList, WithRegionsList } from '../../../ww-clients/features/regions';
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
  serializeForm: serializeForm(['termsOfUse'], ['regions']),
  deserializeForm: deserializeForm(['termsOfUse'], [], ['regions']),
  validationSchema: SourceFormSchema,
});

export default compose(
  sourceForm,
  withScriptsList,
  withRegionsList,
  withLoading<WithScriptsList & WithRegionsList>(props => props.scripts.loading || props.regions.loading),
);
