import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { SectionsStatus } from '@whitewater-guide/clients';
import { Region, Section } from '@whitewater-guide/commons';
import { Screens } from '~/core/navigation';
import {
  RegionTabsNavProp,
  RegionTabsParamsList,
} from '~/screens/region/types';

export interface ItemProps<T> {
  hasPremiumAccess: boolean;
  regionPremium: boolean;
  buyRegion: () => void;
  swipedId: string;
  item: T;
  onPress: (section: Section) => void;
  onMaximize?: (id: string) => void;
  forceCloseCnt?: number;
  testID?: string;
}

export interface ListProps {
  sections: Section[];
  region: Region | null;
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
