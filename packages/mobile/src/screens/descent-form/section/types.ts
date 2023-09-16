import type {
  CompositeNavigationProp,
  RouteProp,
} from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import type { Screens } from '~/core/navigation';
import type {
  DescentFormNavProp,
  DescentFormParamsList,
} from '~/screens/descent-form/types';

export type DescentFormSectionNavProp = CompositeNavigationProp<
  StackNavigationProp<DescentFormParamsList, Screens.DESCENT_FORM_SECTION>,
  DescentFormNavProp
>;

export interface DescentFormSectionNavProps {
  navigation: DescentFormSectionNavProp;
  route: RouteProp<DescentFormParamsList, Screens.DESCENT_FORM_SECTION>;
}
