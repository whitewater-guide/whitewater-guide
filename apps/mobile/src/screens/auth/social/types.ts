import type {
  CompositeNavigationProp,
  RouteProp,
} from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import type { Screens } from '~/core/navigation';

import type { AuthStackNavProp, AuthStackParamsList } from '../types';

export type AuthMainNavProp = CompositeNavigationProp<
  StackNavigationProp<AuthStackParamsList, Screens.AUTH_MAIN>,
  AuthStackNavProp
>;

export interface AuthMainNavProps {
  navigation: AuthMainNavProp;
  route: RouteProp<AuthStackParamsList, Screens.AUTH_MAIN>;
}
