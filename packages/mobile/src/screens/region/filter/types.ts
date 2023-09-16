import type { CompositeNavigationProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { SectionFilterOptions } from '@whitewater-guide/clients';

import type { Screens } from '~/core/navigation';
import type { SelectableTag } from '~/features/tags';
import type {
  RegionScreenNavProp,
  RegionStackParamsList,
} from '~/screens/region/types';

export interface SearchState
  extends Omit<SectionFilterOptions, 'withTags' | 'withoutTags'> {
  kayaking: SelectableTag[];
  hazards: SelectableTag[];
  supply: SelectableTag[];
  misc: SelectableTag[];
}

export type FilterNavProp = CompositeNavigationProp<
  StackNavigationProp<RegionStackParamsList, Screens.FILTER>,
  RegionScreenNavProp
>;

export interface FilterNavProps {
  navigation: FilterNavProp;
}
