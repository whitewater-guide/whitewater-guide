import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import {
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
