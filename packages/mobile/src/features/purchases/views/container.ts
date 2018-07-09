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
}

interface MergedProps extends OwnProps, StateProps {
  onFetchProduct: () => void;
}

const container = connect<StateProps, DispatchProp, OwnProps, MergedProps>(
  (state: RootState) => ({
    region: state.purchase.dialogData && state.purchase.dialogData!.region,
    step: state.purchase.dialogStep,
  }),
  (dispatch) => ({ dispatch }),
  (state, { dispatch }, ownProps) => ({
    ...state,
    ...ownProps,
    onFetchProduct: () => dispatch(purchaseActions.fetch(state.region.sku)),
  }),
);

export default container;
