import { compose } from 'react-apollo';
import { withRegionsList } from '../../../ww-clients/features/regions';
import { withMe } from '../../../ww-clients/features/users';

export default compose(
  withMe(),
  withRegionsList,
);
