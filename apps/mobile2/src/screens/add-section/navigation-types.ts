import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RegionDetailsFragment } from '@whitewater-guide/clients';

import type { RootStackParamsList, Screens } from '../../core/navigation';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type AddSectionTabsParamsList = {
  [Screens.ADD_SECTION_MAIN]: {
    region?: RegionDetailsFragment | null;
  };
  [Screens.ADD_SECTION_ATTRIBUTES]: {
    region?: RegionDetailsFragment | null;
  };
  [Screens.ADD_SECTION_DESCRIPTION]: {
    region?: RegionDetailsFragment | null;
  };
  [Screens.ADD_SECTION_FLOWS]: {
    region?: RegionDetailsFragment | null;
  };
  [Screens.ADD_SECTION_PHOTOS]: {
    region?: RegionDetailsFragment | null;
  };
};

export type AddSectionTabsScreenProps = NativeStackScreenProps<
  RootStackParamsList,
  typeof Screens.ADD_SECTION_TABS
>;
