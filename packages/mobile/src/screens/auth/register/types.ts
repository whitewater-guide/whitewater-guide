import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Screens } from '~/core/navigation';

import { AuthStackNavProp, AuthStackParamsList } from '../types';

export type AuthRegisterNavProp = CompositeNavigationProp<
  StackNavigationProp<AuthStackParamsList, Screens.AUTH_REGISTER>,
  AuthStackNavProp
>;

export interface AuthRegisterNavProps {
  navigation: AuthRegisterNavProp;
  route: RouteProp<AuthStackParamsList, Screens.AUTH_REGISTER>;
}
