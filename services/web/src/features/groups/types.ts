import { WithGroupsList } from '@whitewater-guide/clients';
import { GroupInput } from '@whitewater-guide/commons';

export interface WithGroupMutations {
  upsertGroup: (group: GroupInput) => void;
  removeGroup: (id: string) => void;
}

export type GroupsFormProps = WithGroupsList & WithGroupMutations;
