import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import {
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
