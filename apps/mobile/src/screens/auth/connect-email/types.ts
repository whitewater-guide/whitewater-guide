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

export type ConnectEmailNavProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamsList, Screens.CONNECT_EMAIL>,
  StackNavigationProp<RootDrawerParamsList>
>;

export interface ConnectEmailNavProps {
  navigation: ConnectEmailNavProp;
  route: RouteProp<RootStackParamsList, Screens.CONNECT_EMAIL>;
}
