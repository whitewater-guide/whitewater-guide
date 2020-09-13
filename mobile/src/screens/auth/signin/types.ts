import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Screens } from '~/core/navigation';

import { AuthStackNavProp, AuthStackParamsList } from '../types';

export type AuthSignInNavProp = CompositeNavigationProp<
  StackNavigationProp<AuthStackParamsList, Screens.AUTH_SIGN_IN>,
  AuthStackNavProp
>;

export interface AuthSignInNavProps {
  navigation: AuthStackNavProp;
  route: RouteProp<AuthStackParamsList, Screens.AUTH_SIGN_IN>;
}
