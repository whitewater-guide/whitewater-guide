import { Themeable } from '../../styles';
import { TagInput, WithTags } from '../../ww-commons';

export interface WithTagMutations {
  upsertTag: (tag: TagInput) => void;
  removeTag: (id: string) => void;
}

export type TagsFormProps = WithTags & Themeable & WithTagMutations;
