import {
  NodeRef,
  Overwrite,
  SectionInput,
  TagInput,
} from '@whitewater-guide/commons';
import { MdEditorValue } from '@whitewater-guide/md-editor';

export type SectionFormData = Overwrite<
  Omit<SectionInput, 'tags'>,
  {
    description: MdEditorValue;
    river: NodeRef;
    kayakingTags: TagInput[];
    hazardsTags: TagInput[];
    supplyTags: TagInput[];
    miscTags: TagInput[];
  }
>;

export interface RouterParams {
  regionId: string;
  sectionId?: string;
}
