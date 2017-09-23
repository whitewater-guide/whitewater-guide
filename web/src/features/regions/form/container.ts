import { ApolloError, ChildProps, graphql } from 'react-apollo';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { compose, lifecycle, mapProps, withState } from 'recompose';
import { ConfigProps, reduxForm } from 'redux-form';
import { withLoading } from '../../../components';
import { validateInput } from '../../../components/forms';
import { withRegion, WithRegion } from '../../../ww-clients/features/regions';
import { RegionDetails, RegionFormSchema } from '../../../ww-commons';
import deserializeForm from './deserializeForm';
import serializeForm from './serializeForm';
import { RegionFormInput } from './types';
import UPSERT_REGION from './upsertRegion.mutation';

interface Result {
  upsertRegion: RegionDetails;
}

type WithUpsertRegion = ChildProps<WithRegion, Result>;

interface FormMutationState {
  loading: boolean;
  error?: ApolloError;
}

interface FormMeta {
  mutationState: FormMutationState;
  setMutationState: (value: FormMutationState) => void;
}

type FormProps = Partial<ConfigProps<RegionFormInput>>;

type MappedProps = WithUpsertRegion & FormMeta & RouteComponentProps<any>;

const regionForm = compose(
  withRegion({ errorOnMissingId: false }),
  graphql<Result, WithRegion>(
    UPSERT_REGION,
    {
      alias: 'withUpsertRegion',
    },
  ),
  withRouter,
  withState('mutationState', 'setMutationState', { loading: false }),
  mapProps<FormProps, MappedProps>(({ region, history, mutate, data, setMutationState, ...props }) => ({
    region,
    initialValues: deserializeForm(region.data!),
    onSubmit: async (input: RegionFormInput) => {
      try {
        setMutationState({ loading: true, error: undefined });
        await mutate!({ variables: { region: serializeForm(input) } });
        setMutationState({ loading: false, error: undefined });
        history.replace('/regions');
      } catch (error) {
        setMutationState({ loading: false, error });
      }
    },
    ...props,
  })),
  withLoading<WithRegion & FormMeta>(({ region, mutationState }) => (region.loading || mutationState.loading)),
  reduxForm({
    form: 'region',
    validate: validateInput(RegionFormSchema),
  }),
);

export default regionForm;
