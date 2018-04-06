import { GroupInput, WithGroups } from '../../ww-commons';

export interface WithGroupMutations {
  upsertGroup: (group: GroupInput) => void;
  removeGroup: (id: string) => void;
}

export type GroupsFormProps = WithGroups & WithGroupMutations;
