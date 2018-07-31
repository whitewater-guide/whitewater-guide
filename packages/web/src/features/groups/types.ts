import { WithGroupsList } from '../../ww-clients/features/groups';
import { GroupInput } from '../../ww-commons';

export interface WithGroupMutations {
  upsertGroup: (group: GroupInput) => void;
  removeGroup: (id: string) => void;
}

export type GroupsFormProps = WithGroupsList & WithGroupMutations;
