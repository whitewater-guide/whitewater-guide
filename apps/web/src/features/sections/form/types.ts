import type { MdEditorValue } from '@whitewater-guide/md-editor';
import type {
  NamedNode,
  RefInput,
  SectionInput,
  TagInput,
} from '@whitewater-guide/schema';
import type { Overwrite } from 'utility-types';

export type SectionFormData = Overwrite<
  Omit<SectionInput, 'tags'>,
  {
    description: MdEditorValue;
    river: RefInput;
    timezone?: NamedNode | null;
  }
> & {
  kayakingTags: TagInput[];
  hazardsTags: TagInput[];
  supplyTags: TagInput[];
  miscTags: TagInput[];
};

export interface RouterParams {
  regionId: string;
  sectionId?: string;
}
