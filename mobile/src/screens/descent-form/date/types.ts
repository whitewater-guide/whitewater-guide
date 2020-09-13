import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Screens } from '~/core/navigation';

import { DescentFormNavProp, DescentFormParamsList } from '../types';

export type DescentFormDateNavProp = CompositeNavigationProp<
  StackNavigationProp<DescentFormParamsList, Screens.DESCENT_FORM_DATE>,
  DescentFormNavProp
>;

export interface DescentFormDateNavProps {
  navigation: DescentFormDateNavProp;
  route: RouteProp<DescentFormParamsList, Screens.DESCENT_FORM_DATE>;
}
