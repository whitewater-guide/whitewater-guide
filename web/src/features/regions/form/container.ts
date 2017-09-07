import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import { reduxForm } from 'redux-form';
import { withLoading } from '../../../components';
import { validateInput } from '../../../components/forms';
import { withRegion, WithRegion } from '../../../ww-clients/features/regions';
import { Region, RegionFormSchema, RegionInput } from '../../../ww-commons';
import UPSERT_REGION from './upsertRegion.mutation';

interface Result {
  upsertRegion: Region;
}

const regionForm = compose(
  withRegion({ propName: 'initialValues', withBounds: true, errorOnMissingId: false }),
  graphql<Result, WithRegion>(
    UPSERT_REGION,
    {
      props: ({ mutate, data, ownProps }) => ({
        onSubmit: (region: RegionInput) => mutate!({ variables: { region } }),
        regionLoading: ownProps.regionLoading || (data && data.loading),
      }),
      alias: 'withUpsertRegion',
    },
  ),
  withLoading<WithRegion>(props => props.regionLoading),
  reduxForm({
    form: 'region',
    validate: validateInput(RegionFormSchema),
  }),
);

export default regionForm;
