import { compose } from 'recompose';
import { withLoading } from '../../../components';
import { withRegion, WithRegion } from '../../../ww-clients/features/regions';
import { withSectionsList } from '../../../ww-clients/features/sections';

export default compose(
  withRegion(),
  withLoading<WithRegion>(props => props.region.loading),
  withSectionsList(),
);
