/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RouteProp } from '@react-navigation/native';
import { RegionDetailsFragment } from '@whitewater-guide/clients';
import { License } from '@whitewater-guide/schema';

import { PurchaseParams } from '~/features/purchases/types';
import { DescentFormData } from '~/screens/descent-form';

import { Screens } from './screen-names';

export type RootDrawerParamsList = {
  [Screens.ROOT_STACK]: undefined;
};

export type RootStackParamsList = {
  [Screens.REGIONS_LIST]: undefined;
  [Screens.REGION_STACK]: { regionId: string };
  [Screens.SECTION_SCREEN]: { sectionId: string };
  [Screens.PLAIN]: {
    title?: string;
    text?: string | null;
  };
  [Screens.WEB_VIEW]: {
    fixture?: string;
    title?: string;
  };
  [Screens.LICENSE]: {
    placement: 'region' | 'section' | 'media';
    license: License;
    copyright?: string | null;
  };
  [Screens.SUGGESTION]: {
    sectionId: string;
    localPhotoId?: string;
  };
  [Screens.AUTH_STACK]: undefined;
  [Screens.PURCHASE_STACK]: PurchaseParams;
  [Screens.MY_PROFILE]: undefined;
  [Screens.LOGBOOK]: undefined;
  [Screens.DESCENT_FORM]: {
    regionId?: string;
    descentId?: string;
    shareToken?: string;
    formData?: Partial<DescentFormData>;
  };
  [Screens.DESCENT]: {
    descentId: string;
  };
  [Screens.ADD_SECTION_SCREEN]: {
    region?: RegionDetailsFragment | null;
    fromDescentFormKey?: string;
  };
  [Screens.CHAT]: {
    roomId: string;
  };
};

declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface RootParamList extends RootStackParamsList {}
  }
}

export type RootStackNav = DrawerNavigationProp<
  RootDrawerParamsList,
  Screens.ROOT_STACK
>;

export interface RootStackNavProps {
  navigation: RootStackNav;
  route: RouteProp<RootDrawerParamsList, Screens.ROOT_STACK>;
}
