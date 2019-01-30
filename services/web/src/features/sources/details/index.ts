import { withSource, WithSource } from '@whitewater-guide/clients';
import { RouteComponentProps } from 'react-router-dom';
import { compose } from 'recompose';
import { withLoading } from '../../../components';
import { SourceDetails } from './SourceDetails';

export default compose<WithSource & RouteComponentProps<any>, {}>(
  withSource(),
  withLoading<WithSource>((props) => props.source.loading),
)(SourceDetails);
