import {
  CompositeNavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DescentInput, Section } from '@whitewater-guide/commons';

import {
  RootDrawerParamsList,
  RootStackParamsList,
  Screens,
} from '~/core/navigation';

export type DescentFormData = Omit<DescentInput, 'sectionId'> & {
  section: Section;
};

export type DescentFormNavProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamsList, Screens.DESCENT_FORM>,
  StackNavigationProp<RootDrawerParamsList>
>;

export interface DescentFormNavProps {
  navigation: DescentFormNavProp;
  route: RouteProp<RootStackParamsList, Screens.DESCENT_FORM>;
}

export interface DescentFormParamsList extends ParamListBase {
  [Screens.DESCENT_FORM_SECTION]: { regionId?: string } | undefined;
  [Screens.DESCENT_FORM_DATE]: undefined;
  [Screens.DESCENT_FORM_LEVEL]: undefined;
  [Screens.DESCENT_FORM_COMMENT]: undefined;
}
