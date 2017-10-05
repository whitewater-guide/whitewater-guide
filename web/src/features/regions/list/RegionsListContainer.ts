import { compose } from 'recompose';
import { withLoading } from '../../../components';
import { withRegionsList, WithRegionsList } from '../../../ww-clients/features/regions';
import withRemoveRegion from './withRemoveRegion';

export default compose(
  withRegionsList,
  withRemoveRegion,
  withLoading<WithRegionsList>(({ regions }) => regions.loading),
);
