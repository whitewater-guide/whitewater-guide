import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screens } from '~/core/navigation';
import { PurchaseStackNavProp, PurchaseStackParamsList } from '../types';

export type PurchaseAlreadyHaveNavProp = CompositeNavigationProp<
  StackNavigationProp<PurchaseStackParamsList, Screens.PURCHASE_ALREADY_HAVE>,
  PurchaseStackNavProp
>;

export interface PurchaseAlreadyHaveNavProps {
  navigation: PurchaseStackNavProp;
  route: RouteProp<PurchaseStackParamsList, Screens.PURCHASE_ALREADY_HAVE>;
}
