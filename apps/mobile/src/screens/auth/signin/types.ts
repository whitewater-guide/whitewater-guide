import type {
  CompositeNavigationProp,
  RouteProp,
} from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import type { Screens } from '~/core/navigation';

import type { AuthStackNavProp, AuthStackParamsList } from '../types';

export type AuthSignInNavProp = CompositeNavigationProp<
  StackNavigationProp<AuthStackParamsList, Screens.AUTH_SIGN_IN>,
  AuthStackNavProp
>;

export interface AuthSignInNavProps {
  navigation: AuthSignInNavProp;
  route: RouteProp<AuthStackParamsList, Screens.AUTH_SIGN_IN>;
}
