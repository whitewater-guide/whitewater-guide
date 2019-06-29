import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../../core/redux/reducers';
import { purchaseActions } from '../../actions';
import { PremiumRegion } from '../../types';
import SuccessStep from './SuccessStep';

interface DispatchProps {
  onComplete?: () => void;
}

interface StateProps {
  region: PremiumRegion;
}

const container = connect<StateProps, DispatchProps, any, RootState>(
  (state: RootState) => ({
    region: state.purchase.dialogData!.region,
  }),
  (dispatch) => ({
    onComplete: () => dispatch(purchaseActions.reset()),
  }),
);

const SuccessStepWithData: React.ComponentType<{}> = container(SuccessStep);

export default SuccessStepWithData;
