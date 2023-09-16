import type {
  CompositeNavigationProp,
  RouteProp,
} from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import type { Screens } from '~/core/navigation';

import type { DescentFormNavProp, DescentFormParamsList } from '../types';

export type DescentFormDateNavProp = CompositeNavigationProp<
  StackNavigationProp<DescentFormParamsList, Screens.DESCENT_FORM_DATE>,
  DescentFormNavProp
>;

export interface DescentFormDateNavProps {
  navigation: DescentFormDateNavProp;
  route: RouteProp<DescentFormParamsList, Screens.DESCENT_FORM_DATE>;
}
