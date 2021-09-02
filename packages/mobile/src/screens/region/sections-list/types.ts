import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import {
  ListedSectionFragment,
  RegionDetailsFragment,
  SectionsStatus,
} from '@whitewater-guide/clients';
import { BannerWithSourceFragment } from '@whitewater-guide/schema';

import { Screens } from '~/core/navigation';

import { RegionTabsNavProp, RegionTabsParamsList } from '../types';

export interface ItemProps<T> {
  hasPremiumAccess: boolean;
  regionPremium?: boolean | null;
  buyRegion: () => void;
  swipedId: string;
  item: T;
  onPress: (section: ListedSectionFragment) => void;
  onSwipe?: (id: string) => void;
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

export interface SwipeableSectionTipItem {
  __typename: 'SwipeableSectionTipItem';
  id: string;
}

export type SectionsListDataItem =
  | SwipeableSectionTipItem
  | ListedSectionFragment
  | BannerWithSourceFragment;
