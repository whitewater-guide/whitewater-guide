import { TagInput, WithTags } from '@whitewater-guide/commons';

export interface WithTagMutations {
  upsertTag: (tag: TagInput) => void;
  removeTag: (id: string) => void;
}

export type TagsFormProps = WithTags & WithTagMutations;
