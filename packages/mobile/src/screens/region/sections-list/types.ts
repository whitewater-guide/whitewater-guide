import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import {
  ListedSectionFragment,
  RegionDetailsFragment,
  SectionsStatus,
} from '@whitewater-guide/clients';

import { Screens } from '~/core/navigation';
import {
  RegionTabsNavProp,
  RegionTabsParamsList,
} from '~/screens/region/types';

export interface ItemProps<T> {
  hasPremiumAccess: boolean;
  regionPremium?: boolean | null;
  buyRegion: () => void;
  swipedId: string;
  item: T;
  onPress: (section: ListedSectionFragment) => void;
  onMaximize?: (id: string) => void;
  forceCloseCnt?: number;
  testID?: string;
}

export interface ListProps {
  sections: ListedSectionFragment[];
  region?: RegionDetailsFragment | null;
  refresh: () => Promise<any>;
  status: SectionsStatus;
}

export type RegionSectionsNavProp = CompositeNavigationProp<
  MaterialBottomTabNavigationProp<
    RegionTabsParamsList,
    Screens.REGION_SECTIONS_LIST
  >,
  RegionTabsNavProp
>;

export interface RegionSectionsNavProps {
  navigation: RegionSectionsNavProp;
  route: RouteProp<RegionTabsParamsList, Screens.REGION_SECTIONS_LIST>;
}
