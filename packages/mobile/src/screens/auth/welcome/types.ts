import type {
  CompositeNavigationProp,
  RouteProp,
} from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import type { Screens } from '~/core/navigation';

import type { AuthStackNavProp, AuthStackParamsList } from '../types';

export type AuthWelcomeNavProp = CompositeNavigationProp<
  StackNavigationProp<AuthStackParamsList, Screens.AUTH_WELCOME>,
  AuthStackNavProp
>;

export interface AuthWelcomeNavProps {
  navigation: AuthWelcomeNavProp;
  route: RouteProp<AuthStackParamsList, Screens.AUTH_WELCOME>;
}
