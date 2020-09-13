import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Screens } from '~/core/navigation';

import { AuthStackNavProp, AuthStackParamsList } from '../types';

export type AuthWelcomeNavProp = CompositeNavigationProp<
  StackNavigationProp<AuthStackParamsList, Screens.AUTH_WELCOME>,
  AuthStackNavProp
>;

export interface AuthWelcomeNavProps {
  navigation: AuthStackNavProp;
  route: RouteProp<AuthStackParamsList, Screens.AUTH_WELCOME>;
}
