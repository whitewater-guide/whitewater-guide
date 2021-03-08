import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import {
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
