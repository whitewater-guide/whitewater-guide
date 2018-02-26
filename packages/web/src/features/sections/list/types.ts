import { RouteComponentProps } from 'react-router-dom';
import { WithDeleteMutation } from '../../../apollo';
import { WithSectionsList } from '../../../ww-clients/features/sections';

export type SectionsListProps =
  WithSectionsList &
  WithDeleteMutation<'removeSection'> &
  RouteComponentProps<{regionId: string}>;
