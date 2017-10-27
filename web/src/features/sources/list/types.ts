import { RouteComponentProps } from 'react-router-dom';
import { WithDeleteMutation } from '../../../apollo';
import { WithSourcesList } from '../../../ww-clients/features/sources';

export type SourceListProps = WithSourcesList & WithDeleteMutation<'removeSource'> & RouteComponentProps<any>;