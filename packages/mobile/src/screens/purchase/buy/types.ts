import { IAPError } from '../../../features/purchases';

export interface PurchaseState {
  loading?: boolean;
  error?: IAPError;
  button: string;
  onPress?: () => void;
}
