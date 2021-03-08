import {
  CompositeNavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import {
  RootDrawerParamsList,
  RootStackParamsList,
  Screens,
} from '~/core/navigation';

export type AuthStackNavProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamsList, Screens.SECTION_SCREEN>,
  StackNavigationProp<RootDrawerParamsList>
>;

export interface AuthStackNavProps {
  navigation: AuthStackNavProp;
  route: RouteProp<RootStackParamsList, Screens.SECTION_SCREEN>;
}

export interface AuthStackParamsList extends ParamListBase {
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
}
