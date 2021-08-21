import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Screens } from '~/core/navigation';

import { AuthStackNavProp, AuthStackParamsList } from '../types';

export type AuthForgotNavProp = CompositeNavigationProp<
  StackNavigationProp<AuthStackParamsList, Screens.AUTH_FORGOT>,
  AuthStackNavProp
>;

export interface AuthForgotNavProps {
  navigation: AuthForgotNavProp;
  route: RouteProp<AuthStackParamsList, Screens.AUTH_FORGOT>;
}
