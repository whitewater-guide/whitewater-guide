import { SectionSearchTerms, SelectableTag } from '@whitewater-guide/commons';

export interface SearchState
  extends Omit<SectionSearchTerms, 'withTags' | 'withoutTags'> {
  kayaking: SelectableTag[];
  hazards: SelectableTag[];
  supply: SelectableTag[];
  misc: SelectableTag[];
}

export interface NavParams {
  regionId: string;
}
