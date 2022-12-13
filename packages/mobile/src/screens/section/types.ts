import {
  CompositeNavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import {
  RootDrawerParamsList,
  RootStackParamsList,
  Screens,
} from '~/core/navigation';

export type SectionScreenNavProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamsList, Screens.SECTION_SCREEN>,
  StackNavigationProp<RootDrawerParamsList>
>;

export interface SectionScreenNavProps {
  navigation: SectionScreenNavProp;
  route: RouteProp<RootStackParamsList, Screens.SECTION_SCREEN>;
}

/**
 * sectionId is not necessary for the app to work
 * it's here because passing it via [initialParams](https://reactnavigation.org/docs/screen#initialparams)
 * seems to be simplest way to track screen params in sentry
 */
export interface SectionTabsParamsList extends ParamListBase {
  [Screens.SECTION_MAP]: { sectionId?: string } | undefined;
  [Screens.SECTION_CHART]: { sectionId?: string } | undefined;
  [Screens.SECTION_INFO]: { sectionId?: string } | undefined;
  [Screens.SECTION_FAKE_CHAT]: undefined;
  [Screens.SECTION_MEDIA]: { sectionId?: string } | undefined;
}
