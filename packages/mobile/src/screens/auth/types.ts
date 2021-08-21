import { DrawerNavigationProp } from '@react-navigation/drawer';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import {
  RootDrawerParamsList,
  RootStackParamsList,
  Screens,
} from '~/core/navigation';

export type AuthStackNavProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamsList, Screens.AUTH_STACK>,
  DrawerNavigationProp<RootDrawerParamsList>
>;

export interface AuthStackNavProps {
  navigation: AuthStackNavProp;
  route: RouteProp<RootStackParamsList, Screens.AUTH_STACK>;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type AuthStackParamsList = {
  [Screens.AUTH_MAIN]: undefined;
  [Screens.AUTH_SIGN_IN]: undefined;
  [Screens.AUTH_REGISTER]: undefined;
  [Screens.AUTH_FORGOT]: undefined;
  [Screens.AUTH_RESET]: {
    id: string;
    token: string;
  };
  [Screens.AUTH_WELCOME]: {
    verified?: boolean;
  };
};
