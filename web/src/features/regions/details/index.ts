import { compose } from 'recompose';
import { withLoading } from '../../../components';
import { withRegion, WithRegion } from '../../../ww-clients/features/regions';
import { RegionDetails } from './RegionDetails';

export default compose(
  withRegion(),
  withLoading<WithRegion>(props => props.region.loading),
)(RegionDetails);
