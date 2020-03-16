import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screens } from '~/core/navigation';
import { PurchaseStackNavProp, PurchaseStackParamsList } from '../types';

export type PurchaseSuccessNavProp = CompositeNavigationProp<
  StackNavigationProp<PurchaseStackParamsList, Screens.PURCHASE_SUCCESS>,
  PurchaseStackNavProp
>;

export interface PurchaseSuccessNavProps {
  navigation: PurchaseStackNavProp;
  route: RouteProp<PurchaseStackParamsList, Screens.PURCHASE_SUCCESS>;
}
