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

export type ConnectEmailRequestNavProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamsList, Screens.CONNECT_EMAIL_REQUEST>,
  StackNavigationProp<RootDrawerParamsList>
>;

export interface ConnectEmailRequestNavProps {
  navigation: ConnectEmailRequestNavProp;
  route: RouteProp<RootStackParamsList, Screens.CONNECT_EMAIL_REQUEST>;
}
