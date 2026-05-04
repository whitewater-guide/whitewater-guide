import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';

import type { Screens } from '../../../core/navigation';
import type {
  RegionTabsParamsList,
  RegionTabsScreenProps,
} from '../navigation-types';

export type RegionSectionsListScreenProps = CompositeScreenProps<
  BottomTabScreenProps<
    RegionTabsParamsList,
    typeof Screens.REGION_SECTIONS_LIST
  >,
  RegionTabsScreenProps
>;
