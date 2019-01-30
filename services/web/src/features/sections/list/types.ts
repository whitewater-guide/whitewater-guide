import { WithSectionsList } from '@whitewater-guide/clients';
import { RouteComponentProps } from 'react-router-dom';
import { WithDeleteMutation } from '../../../apollo';

export type SectionsListProps = WithSectionsList &
  WithDeleteMutation<'removeSection'> &
  RouteComponentProps<{ regionId: string }>;
