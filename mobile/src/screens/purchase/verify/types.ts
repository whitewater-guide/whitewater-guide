import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Screens } from '~/core/navigation';

import { PurchaseStackNavProp, PurchaseStackParamsList } from '../types';

export type PurchaseVerifyNavProp = CompositeNavigationProp<
  StackNavigationProp<PurchaseStackParamsList, Screens.PURCHASE_VERIFY>,
  PurchaseStackNavProp
>;

export interface PurchaseVerifyNavProps {
  navigation: PurchaseStackNavProp;
  route: RouteProp<PurchaseStackParamsList, Screens.PURCHASE_VERIFY>;
}
