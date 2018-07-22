import { RouteComponentProps } from 'react-router-dom';
import { compose } from 'recompose';
import { withLoading } from '../../../components';
import { withSource, WithSource } from '../../../ww-clients/features/sources';
import { SourceDetails } from './SourceDetails';

export default compose<WithSource & RouteComponentProps<any>, {}>(
  withSource(),
  withLoading<WithSource>(props => props.source.loading),
)(SourceDetails);
