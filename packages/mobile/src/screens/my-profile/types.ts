import type {
  CompositeNavigationProp,
  RouteProp,
} from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import type {
  RootDrawerParamsList,
  RootStackParamsList,
  Screens,
} from '~/core/navigation';

export type MyProfileNavProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamsList, Screens.MY_PROFILE>,
  StackNavigationProp<RootDrawerParamsList>
>;

export interface MyProfileNavProps {
  navigation: MyProfileNavProp;
  route: RouteProp<RootStackParamsList, Screens.MY_PROFILE>;
}
