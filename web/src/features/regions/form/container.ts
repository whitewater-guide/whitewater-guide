import { graphql } from 'react-apollo';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { compose, lifecycle, mapProps, withState } from 'recompose';
import { formContainer } from '../../../components/forms';
import { withRegion } from '../../../ww-clients/features/regions';
import { RegionFormSchema } from '../../../ww-commons';
import deserializeForm from './deserializeForm';
import serializeForm from './serializeForm';
import UPSERT_REGION from './upsertRegion.mutation';

const regionForm = formContainer({
  formName: 'region',
  propName: 'region',
  backPath: '/regions',
  queryContainer: withRegion({ errorOnMissingId: false }),
  mutationContainer: graphql(UPSERT_REGION, { alias: 'withUpsertRegion' }),
  serializeForm,
  deserializeForm,
  validationSchema: RegionFormSchema,
});

export default regionForm;
