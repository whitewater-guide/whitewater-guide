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

export type PlainNavProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamsList, Screens.PLAIN>,
  StackNavigationProp<RootDrawerParamsList>
>;

export interface PlainNavProps {
  navigation: PlainNavProp;
  route: RouteProp<RootStackParamsList, Screens.PLAIN>;
}
