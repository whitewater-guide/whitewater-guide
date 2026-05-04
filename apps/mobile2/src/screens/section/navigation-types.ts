import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamsList, Screens } from '../../core/navigation';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type SectionTabsParamsList = {
  [Screens.SECTION_MAP]: undefined;
  [Screens.SECTION_CHART]: undefined;
  [Screens.SECTION_INFO]: undefined;
  [Screens.SECTION_MEDIA]: undefined;
};

export type SectionScreenProps = NativeStackScreenProps<
  RootStackParamsList,
  typeof Screens.SECTION_SCREEN
>;
