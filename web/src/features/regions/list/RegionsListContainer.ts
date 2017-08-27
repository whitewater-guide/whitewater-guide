import { compose } from 'recompose';
import { withLoading } from '../../../components';
import { withRegionsList, WithRegionsList } from '../../../ww-clients/features/regions';

export default compose(
  withRegionsList,
  withLoading<WithRegionsList>(({ regions }) => regions.loading),
);
