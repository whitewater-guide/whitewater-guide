import { NamedNode } from '../../apollo';

export enum TagCategory {
  kayaking = 'kayaking',
  hazards = 'hazards',
  supply = 'supply',
  misc = 'misc',
}

export enum TagSelection {
  SELECTED = 'selected',
  DESELECTED = 'deselected',
  NONE = 'none',
}

export const TagSelections = [
  TagSelection.NONE,
  TagSelection.SELECTED,
  TagSelection.DESELECTED,
];

export const TAG_CATEGORIES = ['kayaking', 'hazards', 'supply', 'misc'];

export interface Tag extends NamedNode {
  category: TagCategory;
}

export interface SelectableTag extends Tag {
  selection?: TagSelection;
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
