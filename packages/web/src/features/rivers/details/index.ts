import { compose } from 'recompose';
import { withLoading } from '../../../components/withLoading';
import { withRiver, WithRiver } from '../../../ww-clients/features/rivers';
import RiverDetails from './RiverDetails';

export default compose(
  withRiver(),
  withLoading<WithRiver>(props => props.river.loading),
)(RiverDetails);
