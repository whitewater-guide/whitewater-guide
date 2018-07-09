import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../../core/reducers';
import { purchaseActions } from '../../actions';
import SuccessStep from './SuccessStep';
import { PremiumRegion } from '../../types';

interface DispatchProps {
  onComplete?: () => void;
}

interface StateProps {
  region: PremiumRegion;
}

const container = connect<StateProps, DispatchProps>(
  (state: RootState) => ({
    region: state.purchase.dialogData!.region,
  }),
  (dispatch) => ({
    onComplete: () => dispatch(purchaseActions.reset()),
  }),
);

const SuccessStepWithData: React.ComponentType<{}> = container(SuccessStep);

export default SuccessStepWithData;
