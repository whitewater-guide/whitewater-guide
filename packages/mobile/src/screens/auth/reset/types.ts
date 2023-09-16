import type {
  CompositeNavigationProp,
  RouteProp,
} from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import type { Screens } from '~/core/navigation';

import type { AuthStackNavProp, AuthStackParamsList } from '../types';

export type AuthResetNavProp = CompositeNavigationProp<
  StackNavigationProp<AuthStackParamsList, Screens.AUTH_RESET>,
  AuthStackNavProp
>;

export interface AuthResetNavProps {
  navigation: AuthResetNavProp;
  route: RouteProp<AuthStackParamsList, Screens.AUTH_RESET>;
}
