import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamsList, Screens } from '../../core/navigation';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type RegionTabsParamsList = {
  [Screens.REGION_MAP]: undefined;
  [Screens.REGION_SECTIONS_LIST]: undefined;
  [Screens.REGION_INFO]: undefined;
};

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type RegionStackParamsList = {
  [Screens.REGION_TABS]: undefined;
  [Screens.FILTER]: undefined;
};

export type RegionScreenProps = NativeStackScreenProps<
  RootStackParamsList,
  typeof Screens.REGION_STACK
>;

export type RegionTabsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<RegionStackParamsList, typeof Screens.REGION_TABS>,
  RegionScreenProps
>;
