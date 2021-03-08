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

export interface SectionTabsParamsList extends ParamListBase {
  [Screens.SECTION_MAP]: undefined;
  [Screens.SECTION_CHART]: undefined;
  [Screens.SECTION_INFO]: undefined;
  [Screens.SECTION_GUIDE]: undefined;
  [Screens.SECTION_MEDIA]: undefined;
}
