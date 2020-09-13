import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Screens } from '~/core/navigation';

import { DescentFormNavProp, DescentFormParamsList } from '../types';

export type DescentFormCommentNavProp = CompositeNavigationProp<
  StackNavigationProp<DescentFormParamsList, Screens.DESCENT_FORM_COMMENT>,
  DescentFormNavProp
>;

export interface DescentFormCommentNavProps {
  navigation: DescentFormCommentNavProp;
  route: RouteProp<DescentFormParamsList, Screens.DESCENT_FORM_COMMENT>;
}
