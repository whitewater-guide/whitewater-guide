import type {
  CompositeNavigationProp,
  RouteProp,
} from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import type {
  RootDrawerParamsList,
  RootStackParamsList,
  Screens,
} from '~/core/navigation';

export type LicenseNavProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamsList, Screens.LICENSE>,
  StackNavigationProp<RootDrawerParamsList>
>;

export interface LicenseNavProps {
  navigation: LicenseNavProp;
  route: RouteProp<RootStackParamsList, Screens.LICENSE>;
}
