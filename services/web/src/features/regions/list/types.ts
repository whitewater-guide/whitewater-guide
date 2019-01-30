import { WithRegionsList } from '@whitewater-guide/clients';
import { RouteComponentProps } from 'react-router';
import { WithDeleteMutation } from '../../../apollo';

export type RegionsListProps = WithRegionsList &
  WithDeleteMutation<'removeRegion'> &
  RouteComponentProps<any>;
