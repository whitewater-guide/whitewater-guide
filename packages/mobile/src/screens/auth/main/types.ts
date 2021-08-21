import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Screens } from '~/core/navigation';

import { AuthStackNavProp, AuthStackParamsList } from '../types';

export type AuthMainNavProp = CompositeNavigationProp<
  StackNavigationProp<AuthStackParamsList, Screens.AUTH_MAIN>,
  AuthStackNavProp
>;

export interface AuthMainNavProps {
  navigation: AuthMainNavProp;
  route: RouteProp<AuthStackParamsList, Screens.AUTH_MAIN>;
}
