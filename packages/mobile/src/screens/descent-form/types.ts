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
import { LogbookDescentInput } from '@whitewater-guide/logbook-schema';
import { Overwrite } from '@whitewater-guide/commons';

export type DescentFormData = Overwrite<
  LogbookDescentInput,
  { startedAt: Date }
>;

export type DescentFormNavProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamsList, Screens.DESCENT_FORM>,
  StackNavigationProp<RootDrawerParamsList>
>;

export interface DescentFormNavProps {
  navigation: DescentFormNavProp;
  route: RouteProp<RootStackParamsList, Screens.DESCENT_FORM>;
}

export interface DescentFormParamsList extends ParamListBase {
  [Screens.DESCENT_FORM_SECTION]: undefined;
  [Screens.DESCENT_FORM_DATE]: undefined;
  [Screens.DESCENT_FORM_LEVEL]: undefined;
  [Screens.DESCENT_FORM_COMMENT]: undefined;
}
