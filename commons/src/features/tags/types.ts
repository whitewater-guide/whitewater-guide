export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface WithTags {
  supplyTags: Tag[];
  kayakingTags: Tag[];
  hazardsTags: Tag[];
  miscTags: Tag[];
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
