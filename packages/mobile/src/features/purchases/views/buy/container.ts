import { connect, DispatchProp } from 'react-redux';
import { RootState } from '../../../../core/reducers';
import { purchaseActions } from '../../actions';
import { PremiumRegion, PurchaseState } from '../../types';

interface OwnProps {
  cancelable?: boolean;
}

interface StateProps {
  region: PremiumRegion;
  state: PurchaseState;
  price?: string;
  error?: [string] | [string, { [key: string]: string | undefined }] | null;
}

interface MergedProps extends StateProps, OwnProps {
  onCancel?: () => void;
  onConfirm?: () => void;
}

const container = connect<
  StateProps,
  DispatchProp,
  OwnProps,
  MergedProps,
  RootState
>(
  (state: RootState) => ({
    region: state.purchase.dialogData!.region,
    error: state.purchase.error,
    state: state.purchase.state,
    price: state.purchase.product
      ? state.purchase.product.localizedPrice
      : undefined,
  }),
  (dispatch) => ({ dispatch }),
  (state, { dispatch }, { cancelable }) => {
    let onConfirm = () => {};
    switch (state.state) {
      case PurchaseState.IDLE:
        onConfirm = () => dispatch(purchaseActions.buy(state.region.sku!));
        break;
      case PurchaseState.PRODUCT_LOADING_FAILED:
        onConfirm = () => dispatch(purchaseActions.fetch(state.region.sku!));
        break;
      case PurchaseState.PURCHASE_SAVING_OFFLINE:
        onConfirm = () => dispatch(purchaseActions.retryOfflinePurchases());
        break;
      case PurchaseState.PURCHASE_SAVING_FATAL:
        onConfirm = () => dispatch(purchaseActions.reset());
        break;
      case PurchaseState.PRODUCT_PURCHASING_FAILED:
        onConfirm = () => dispatch(purchaseActions.buy(state.region.sku!));
        break;
      case PurchaseState.REFRESHING_PREMIUM_FAILED:
        onConfirm = () => dispatch(purchaseActions.refresh());
        break;
    }
    return {
      ...state,
      cancelable,
      onCancel: () => dispatch(purchaseActions.reset()),
      onConfirm,
    };
  },
);

export default container;
