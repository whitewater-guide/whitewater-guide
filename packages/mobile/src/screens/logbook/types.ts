import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  RootDrawerParamsList,
  RootStackParamsList,
  Screens,
} from '~/core/navigation';

export type LogbookNavProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamsList, Screens.LOGBOOK>,
  StackNavigationProp<RootDrawerParamsList>
>;

export interface LogbookNavProps {
  navigation: LogbookNavProp;
  route: RouteProp<RootStackParamsList, Screens.LOGBOOK>;
}
