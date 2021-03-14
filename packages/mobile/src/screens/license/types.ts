import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import {
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
