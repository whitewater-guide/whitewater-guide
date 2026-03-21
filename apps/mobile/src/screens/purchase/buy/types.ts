import type {
  CompositeNavigationProp,
  RouteProp,
} from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import type { Screens } from '~/core/navigation';
import type { IAPError } from '~/features/purchases';

import type { PurchaseStackNavProp, PurchaseStackParamsList } from '../types';

export type PurchaseBuyNavProp = CompositeNavigationProp<
  StackNavigationProp<PurchaseStackParamsList, Screens.PURCHASE_BUY>,
  PurchaseStackNavProp
>;

export interface PurchaseBuyNavProps {
  navigation: PurchaseStackNavProp;
  route: RouteProp<PurchaseStackParamsList, Screens.PURCHASE_BUY>;
}

export interface PurchaseState {
  loading?: boolean;
  error?: IAPError;
  button: string;
  onPress?: () => void;
}
