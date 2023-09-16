import type {
  CompositeNavigationProp,
  RouteProp,
} from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import type { Screens } from '~/core/navigation';

import type { PurchaseStackNavProp, PurchaseStackParamsList } from '../types';

export type PurchaseSuccessNavProp = CompositeNavigationProp<
  StackNavigationProp<PurchaseStackParamsList, Screens.PURCHASE_SUCCESS>,
  PurchaseStackNavProp
>;

export interface PurchaseSuccessNavProps {
  navigation: PurchaseStackNavProp;
  route: RouteProp<PurchaseStackParamsList, Screens.PURCHASE_SUCCESS>;
}
