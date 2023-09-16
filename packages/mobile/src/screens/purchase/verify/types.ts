import type {
  CompositeNavigationProp,
  RouteProp,
} from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import type { Screens } from '~/core/navigation';

import type { PurchaseStackNavProp, PurchaseStackParamsList } from '../types';

export type PurchaseVerifyNavProp = CompositeNavigationProp<
  StackNavigationProp<PurchaseStackParamsList, Screens.PURCHASE_VERIFY>,
  PurchaseStackNavProp
>;

export interface PurchaseVerifyNavProps {
  navigation: PurchaseStackNavProp;
  route: RouteProp<PurchaseStackParamsList, Screens.PURCHASE_VERIFY>;
}
