import { RouteComponentProps } from 'react-router-dom';
import { WithDeleteMutation } from '../../../apollo';
import { WithSourcesList } from '../../../ww-clients/features/sources';
import { WithToggleSource } from './withToggleSource';

export type SourceListProps =
  WithSourcesList &
  WithDeleteMutation<'removeSource'> &
  WithToggleSource &
  RouteComponentProps<any>;
