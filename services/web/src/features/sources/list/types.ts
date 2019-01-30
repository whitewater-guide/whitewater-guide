import { WithSourcesList } from '@whitewater-guide/clients';
import { RouteComponentProps } from 'react-router-dom';
import { WithDeleteMutation } from '../../../apollo';
import { WithToggleSource } from './withToggleSource';

export type SourceListProps = WithSourcesList &
  WithDeleteMutation<'removeSource'> &
  WithToggleSource &
  RouteComponentProps<any>;
