import type {
  CompositeNavigationProp,
  RouteProp,
} from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import type { Screens } from '~/core/navigation';

import type { DescentFormNavProp, DescentFormParamsList } from '../types';

export type DescentFormCommentNavProp = CompositeNavigationProp<
  StackNavigationProp<DescentFormParamsList, Screens.DESCENT_FORM_COMMENT>,
  DescentFormNavProp
>;

export interface DescentFormCommentNavProps {
  navigation: DescentFormCommentNavProp;
  route: RouteProp<DescentFormParamsList, Screens.DESCENT_FORM_COMMENT>;
}
