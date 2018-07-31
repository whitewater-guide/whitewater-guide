import { RouteComponentProps } from 'react-router-dom';
import { WithDeleteMutation } from '../../../apollo';
import { WithBannersList } from './container';

export type BannerListProps =
  WithBannersList &
  WithDeleteMutation<'removeBanner'> &
  RouteComponentProps<any>;
