import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screens } from '~/core/navigation';
import { AuthStackNavProp, AuthStackParamsList } from '../types';

export type AuthResetNavProp = CompositeNavigationProp<
  StackNavigationProp<AuthStackParamsList, Screens.AUTH_RESET>,
  AuthStackNavProp
>;

export interface AuthResetNavProps {
  navigation: AuthStackNavProp;
  route: RouteProp<AuthStackParamsList, Screens.AUTH_RESET>;
}
