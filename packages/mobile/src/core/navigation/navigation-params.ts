import { DrawerNavigationProp } from '@react-navigation/drawer';
import { ParamListBase, RouteProp } from '@react-navigation/native';
import { Region } from '@whitewater-guide/commons';
import { PurchaseParams } from '~/features/purchases/types';
import { DescentFormData } from '~/screens/descent-form';
import { Screens } from './screen-names';

export interface RootDrawerParamsList extends ParamListBase {
  [Screens.ROOT_STACK]: undefined;
}

export interface RootStackParamsList extends ParamListBase {
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
  [Screens.SUGGESTION]: {
    sectionId: string;
    localPhotoId?: string;
  };
  [Screens.AUTH_STACK]: undefined;
  [Screens.PURCHASE_STACK]: PurchaseParams;
  [Screens.MY_PROFILE]: undefined;
  [Screens.LOGBOOK]: undefined;
  [Screens.DESCENT_FORM]: {
    descentId?: string;
    shareToken?: string;
    formData?: Partial<DescentFormData>;
  };
  [Screens.DESCENT]: {
    descentId: string;
  };
  [Screens.ADD_SECTION_SCREEN]: { region?: Region | null };
}

export type RootStackNav = DrawerNavigationProp<
  RootDrawerParamsList,
  Screens.ROOT_STACK
>;

export interface RootStackNavProps {
  navigation: RootStackNav;
  route: RouteProp<RootDrawerParamsList, Screens.ROOT_STACK>;
}
