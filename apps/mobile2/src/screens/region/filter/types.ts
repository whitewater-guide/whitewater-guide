import type { SectionFilterOptions } from '@whitewater-guide/clients';

import type { SelectableTag } from '../../../features/tags';

export interface SearchState extends Omit<
  SectionFilterOptions,
  'withTags' | 'withoutTags'
> {
  kayaking: SelectableTag[];
  hazards: SelectableTag[];
  supply: SelectableTag[];
  misc: SelectableTag[];
}
