import { connect, DispatchProp } from 'react-redux';
import { RootState } from '../../../core/reducers';
import { purchaseActions } from '../actions';
import { PremiumRegion, PurchaseDialogStep } from '../types';

interface OwnProps {
  cancelable?: boolean;
}

interface StateProps {
  region: PremiumRegion;
  step: PurchaseDialogStep;
  visible: boolean;
}

export interface MergedProps extends OwnProps, StateProps {
  onFetchProduct: () => void;
  onResetPurchase: () => void;
}

export const container = connect<StateProps, DispatchProp, OwnProps, MergedProps>(
  (state: RootState) => ({
    region: state.purchase.dialogData!.region,
    step: state.purchase.dialogStep,
    visible: state.purchase.dialogOpen,
  }),
  (dispatch) => ({ dispatch }),
  (state, { dispatch }, ownProps) => ({
    ...state,
    ...ownProps,
    onFetchProduct: () => dispatch(purchaseActions.fetch(state.region.sku)),
    onResetPurchase: () => dispatch(purchaseActions.reset()),
  }),
);
