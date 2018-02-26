import { compose } from 'recompose';
import { withLoading } from '../../../components';
import { withSource, WithSource } from '../../../ww-clients/features/sources';
import { SourceDetails } from './SourceDetails';

export default compose(
  withSource(),
  withLoading<WithSource>(props => props.source.loading),
)(SourceDetails);
