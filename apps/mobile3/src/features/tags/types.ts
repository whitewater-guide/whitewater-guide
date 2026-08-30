import type { Tag } from '@whitewater-guide/schema';

export enum TagSelection {
  SELECTED = 'selected',
  DESELECTED = 'deselected',
  NONE = 'none',
}

export const TagSelections = [
  TagSelection.NONE,
  TagSelection.SELECTED,
  TagSelection.DESELECTED,
] as const;

export interface SelectableTag extends Tag {
  selection?: TagSelection;
}
