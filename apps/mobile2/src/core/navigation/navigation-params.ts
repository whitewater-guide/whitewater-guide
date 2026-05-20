/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { NavigatorScreenParams } from '@react-navigation/native';
import type { RegionDetailsFragment } from '@whitewater-guide/clients';

import type { Screens } from './screen-names';

export type RootDrawerParamsList = {
  [Screens.ROOT_STACK]: NavigatorScreenParams<RootStackParamsList>;
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
    localPhotoId?: string;
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
  [Screens.DESCENT_FORM_SECTION]:
    | {
        regionId?: string;
        descentId?: string;
        formData?: Record<string, unknown>;
      }
    | undefined;
  [Screens.DESCENT_FORM_DATE]: undefined;
  [Screens.DESCENT_FORM_LEVEL]: undefined;
  [Screens.DESCENT_FORM_COMMENT]: undefined;
  [Screens.DESCENT]: {
    descentId: string;
  };
  [Screens.ADD_SECTION_TABS]: {
    fromDescentFormKey?: string;
    region?: RegionDetailsFragment | null;
  };
  [Screens.ADD_SECTION_RIVER]: {
    region?: RegionDetailsFragment | null;
  };
  [Screens.ADD_SECTION_GAUGE]: {
    region?: RegionDetailsFragment | null;
  };
  [Screens.ADD_SECTION_SHAPE]: {
    region?: RegionDetailsFragment | null;
  };
  [Screens.ADD_SECTION_PHOTO]: {
    index: number;
    localPhotoId: string;
  };
  [Screens.AUTH_MAIN]: undefined;
  [Screens.AUTH_SIGN_IN]: undefined;
  [Screens.AUTH_REGISTER]: undefined;
  [Screens.AUTH_FORGOT]: undefined;
  [Screens.AUTH_RESET]: { token?: string };
  [Screens.AUTH_WELCOME]: undefined;
};

declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface RootParamList extends RootStackParamsList {}
  }
}
