import { graphql } from 'react-apollo';
import { deserializeForm, formContainer, serializeForm } from '../../../components/forms';
import { withRegion } from '../../../ww-clients/features/regions';
import { RegionFormSchema } from '../../../ww-commons';
import UPSERT_REGION from './upsertRegion.mutation';

const regionForm = formContainer({
  formName: 'region',
  propName: 'region',
  backPath: '/regions',
  queryContainer: withRegion({ errorOnMissingId: false }),
  mutationContainer: graphql(UPSERT_REGION, { alias: 'withUpsertRegion' }),
  serializeForm: serializeForm(['description']),
  deserializeForm: deserializeForm(['description'], ['pois']),
  validationSchema: RegionFormSchema,
});

export default regionForm;
