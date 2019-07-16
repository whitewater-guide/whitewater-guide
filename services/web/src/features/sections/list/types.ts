import { Section } from '@whitewater-guide/commons';
import { RouteComponentProps } from 'react-router-dom';
import { WithDeleteMutation } from '../../../apollo';

export interface OuterProps {
  sections: Section[];
  regionId: string;
}

export type SectionsListProps = OuterProps &
  WithDeleteMutation<'removeSection'> &
  RouteComponentProps<{ regionId: string }>;
