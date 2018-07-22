import { translate } from 'react-i18next';
import { connect, DispatchProp } from 'react-redux';
import { compose } from 'recompose';
import { RootState } from '../../../core/reducers';
import { WithT } from '../../../i18n';
import { purchaseActions } from '../actions';
import { PremiumRegion, PurchaseDialogStep } from '../types';

interface OwnProps {
  cancelable?: boolean;
}

interface StateProps {
  region: PremiumRegion | null;
  step: PurchaseDialogStep;
}

interface MergedProps extends OwnProps, StateProps {
  onFetchProduct: () => void;
}

const container = compose<MergedProps & WithT, OwnProps>(
  connect<StateProps, DispatchProp, OwnProps, MergedProps, RootState>(
    (state: RootState) => ({
      region: state.purchase.dialogData && state.purchase.dialogData!.region,
      step: state.purchase.dialogStep,
    }),
    (dispatch) => ({ dispatch }),
    (state, { dispatch }, ownProps) => ({
      ...state,
      ...ownProps,
      onFetchProduct: () => {
        if (state.region) {
          dispatch(purchaseActions.fetch(state.region.sku!));
        }
      },
    }),
  ),
  translate(),
);

export default container;
