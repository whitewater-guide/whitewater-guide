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

export type DescentNavProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamsList, Screens.DESCENT>,
  StackNavigationProp<RootDrawerParamsList>
>;

export interface DescentNavProps {
  navigation: DescentNavProp;
  route: RouteProp<RootStackParamsList, Screens.DESCENT>;
}
