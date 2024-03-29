import type {
  CompositeNavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import type {
  RootDrawerParamsList,
  RootStackParamsList,
  Screens,
} from '~/core/navigation';
import type { PurchaseParams } from '~/features/purchases/types';

export type PurchaseStackNavProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamsList, Screens.SECTION_SCREEN>,
  StackNavigationProp<RootDrawerParamsList>
>;

export interface PurchaseStackNavProps {
  navigation: PurchaseStackNavProp;
  route: RouteProp<RootStackParamsList, Screens.SECTION_SCREEN>;
}

export interface PurchaseStackParamsList extends ParamListBase {
  [Screens.PURCHASE_BUY]: PurchaseParams;
  [Screens.PURCHASE_ALREADY_HAVE]: PurchaseParams;
  [Screens.PURCHASE_SUCCESS]: PurchaseParams;
  [Screens.PURCHASE_VERIFY]: PurchaseParams;
}
