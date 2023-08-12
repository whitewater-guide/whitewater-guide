import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import {
  RootDrawerParamsList,
  RootStackParamsList,
  Screens,
} from '~/core/navigation';

export type ConnectEmailSuccessNavProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamsList, Screens.CONNECT_EMAIL_SUCCESS>,
  StackNavigationProp<RootDrawerParamsList>
>;

export interface ConnectEmailSuccessNavProps {
  navigation: ConnectEmailSuccessNavProp;
  route: RouteProp<RootStackParamsList, Screens.CONNECT_EMAIL_SUCCESS>;
}
