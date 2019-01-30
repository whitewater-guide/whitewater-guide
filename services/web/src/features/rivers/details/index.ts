import { withRiver, WithRiver } from '@whitewater-guide/clients';
import { compose } from 'recompose';
import { withLoading } from '../../../components';
import RiverDetails from './RiverDetails';

export default compose<WithRiver, {}>(
  withRiver(),
  withLoading<WithRiver>((props) => props.river.loading),
)(RiverDetails);
