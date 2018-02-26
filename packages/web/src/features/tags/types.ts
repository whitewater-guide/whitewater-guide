import { WithLanguage } from '../../components/forms';
import { Themeable } from '../../styles';
import { TagInput, WithTags } from '../../ww-commons';

export interface WithTagMutations {
  upsertTag: (tag: TagInput, language: string) => void;
  removeTag: (id: string) => void;
}

export type TagsFormProps = WithTags & Themeable & WithLanguage & WithTagMutations;
