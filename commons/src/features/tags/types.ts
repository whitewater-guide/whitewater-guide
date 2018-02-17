import { NamedNode } from '../../core';

export enum TagCategory {
  kayaking = 'kayaking',
  hazards = 'hazards',
  supply = 'supply',
  misc = 'misc',
}

export const TAG_CATEGORIES = ['kayaking', 'hazards', 'supply', 'misc'];

export interface Tag extends NamedNode {
  category: TagCategory;
}

export interface TagInput {
  id: string;
  name: string;
  category: TagCategory;
}

export interface WithTags {
  tags: Tag[];
  tagsLoading: boolean;
}

export enum TagSelection {
  SELECTED = 'selected',
  DESELECTED = 'deselected',
  NONE = 'none',
}

export interface SelectableTag extends Tag {
  selection: TagSelection;
}

export interface SelectableTagInput {
  id: string;
  selection: -1 | 1;
}

export interface WithSelectableTags {
  supplyTags: SelectableTag[];
  kayakingTags: SelectableTag[];
  hazardsTags: SelectableTag[];
  miscTags: SelectableTag[];
}
