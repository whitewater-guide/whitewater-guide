import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SectionFilterOptions, SelectableTag } from '@whitewater-guide/commons';

import { Screens } from '~/core/navigation';
import {
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
