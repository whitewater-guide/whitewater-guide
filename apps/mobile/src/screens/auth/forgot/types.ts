import type {
  CompositeNavigationProp,
  RouteProp,
} from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import type { Screens } from '~/core/navigation';

import type { AuthStackNavProp, AuthStackParamsList } from '../types';

export type AuthForgotNavProp = CompositeNavigationProp<
  StackNavigationProp<AuthStackParamsList, Screens.AUTH_FORGOT>,
  AuthStackNavProp
>;

export interface AuthForgotNavProps {
  navigation: AuthForgotNavProp;
  route: RouteProp<AuthStackParamsList, Screens.AUTH_FORGOT>;
}
