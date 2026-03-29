/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { NavigatorScreenParams } from '@react-navigation/native';

import type { Screens } from './screen-names';

export type RootDrawerParamsList = {
  [Screens.ROOT_STACK]: NavigatorScreenParams<RootStackParamsList>;
};

export type DescentFormParamsList = {
  [Screens.DESCENT_FORM_SECTION]: { regionId?: string } | undefined;
  [Screens.DESCENT_FORM_DATE]: undefined;
  [Screens.DESCENT_FORM_LEVEL]: undefined;
  [Screens.DESCENT_FORM_COMMENT]: undefined;
};

export type RegionTabsParamsList = {
  [Screens.REGION_MAP]: undefined;
  [Screens.REGION_SECTIONS_LIST]: undefined;
  [Screens.REGION_INFO]: undefined;
};

export type RegionStackParamsList = {
  [Screens.REGION_TABS]: undefined;
  [Screens.FILTER]: undefined;
};

export type SectionTabsParamsList = {
  [Screens.SECTION_MAP]: undefined;
  [Screens.SECTION_CHART]: undefined;
  [Screens.SECTION_INFO]: undefined;
  [Screens.SECTION_MEDIA]: undefined;
};

export type AddSectionTabsParamsList = {
  [Screens.ADD_SECTION_MAIN]: undefined;
  [Screens.ADD_SECTION_ATTRIBUTES]: undefined;
  [Screens.ADD_SECTION_DESCRIPTION]: undefined;
  [Screens.ADD_SECTION_FLOWS]: undefined;
  [Screens.ADD_SECTION_PHOTOS]: undefined;
};

export type AddSectionStackParamsList = {
  [Screens.ADD_SECTION_TABS]: undefined;
  [Screens.ADD_SECTION_RIVER]: undefined;
  [Screens.ADD_SECTION_GAUGE]: undefined;
  [Screens.ADD_SECTION_SHAPE]: undefined;
  [Screens.ADD_SECTION_PHOTO]: undefined;
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
    placement: string;
    license: unknown;
    copyright?: string | null;
  };
  [Screens.SUGGESTION]: {
    sectionId: string;
  };
  [Screens.MY_PROFILE]: undefined;
  [Screens.CONNECT_EMAIL_REQUEST]: { email?: string };
  [Screens.CONNECT_EMAIL]: {
    email?: string;
    token?: string;
    editableEmail?: boolean;
  };
  [Screens.CONNECT_EMAIL_SUCCESS]: undefined;
  [Screens.LOGBOOK]: undefined;
  [Screens.DESCENT_FORM]:
    | {
        regionId?: string;
        descentId?: string;
        formData?: Record<string, unknown>;
      }
    | undefined;
  [Screens.DESCENT]: {
    descentId: string;
  };
  [Screens.ADD_SECTION_SCREEN]: {
    fromDescentFormKey?: string;
  };
  [Screens.AUTH_MAIN]: undefined;
  [Screens.AUTH_SIGN_IN]: undefined;
  [Screens.AUTH_REGISTER]: undefined;
  [Screens.AUTH_FORGOT]: undefined;
  [Screens.AUTH_RESET]: { token?: string };
  [Screens.AUTH_SOCIAL]: undefined;
  [Screens.AUTH_WELCOME]: undefined;
};

declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface RootParamList extends RootStackParamsList {}
  }
}
