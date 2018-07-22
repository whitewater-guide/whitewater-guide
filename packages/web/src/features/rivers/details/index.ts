import { compose } from 'recompose';
import { withLoading } from '../../../components';
import { withRiver, WithRiver } from '../../../ww-clients/features/rivers';
import RiverDetails from './RiverDetails';

export default compose<WithRiver, {}>(
  withRiver(),
  withLoading<WithRiver>(props => props.river.loading),
)(RiverDetails);
