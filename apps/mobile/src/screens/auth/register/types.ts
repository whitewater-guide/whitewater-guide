import type {
  CompositeNavigationProp,
  RouteProp,
} from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import type { Screens } from '~/core/navigation';

import type { AuthStackNavProp, AuthStackParamsList } from '../types';

export type AuthRegisterNavProp = CompositeNavigationProp<
  StackNavigationProp<AuthStackParamsList, Screens.AUTH_REGISTER>,
  AuthStackNavProp
>;

export interface AuthRegisterNavProps {
  navigation: AuthRegisterNavProp;
  route: RouteProp<AuthStackParamsList, Screens.AUTH_REGISTER>;
}
