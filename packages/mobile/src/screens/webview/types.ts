import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  RootDrawerParamsList,
  RootStackParamsList,
  Screens,
} from '~/core/navigation';

export type WebViewNavProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamsList, Screens.WEB_VIEW>,
  StackNavigationProp<RootDrawerParamsList>
>;

export interface WebViewNavProps {
  navigation: WebViewNavProp;
  route: RouteProp<RootStackParamsList, Screens.WEB_VIEW>;
}
