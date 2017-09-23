import { ChildProps, graphql } from 'react-apollo';
import { compose, mapProps } from 'recompose';
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

type FormProps = Partial<ConfigProps<RegionFormInput>>;
type WithUpsertRegion = ChildProps<WithRegion, Result>;
interface FormLoading { formLoading: boolean; }

const regionForm = compose(
  withRegion({ errorOnMissingId: false }),
  graphql<Result, WithRegion>(
    UPSERT_REGION,
    {
      alias: 'withUpsertRegion',
    },
  ),
  mapProps<FormProps, WithUpsertRegion>(({ region, mutate, data, ...props }) => ({
    region,
    initialValues: deserializeForm(region.data!),
    onSubmit: (input: RegionFormInput) => mutate!({ variables: { region: serializeForm(input) } }),
    formLoading: data && data.loading,
    ...props,
  })),
  withLoading<WithRegion & FormLoading>(({ region, formLoading }) => (region.loading || formLoading)),
  reduxForm({
    form: 'region',
    validate: validateInput(RegionFormSchema),
  }),
);

export default regionForm;
