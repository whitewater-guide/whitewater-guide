import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../../core/reducers';
import { purchaseActions } from '../../actions';
import AlreadyHaveStep from './AlreadyHaveStep';
import { PremiumRegion } from '../../types';

interface DispatchProps {
  onCancel?: () => void;
}

interface StateProps {
  region: PremiumRegion;
}

const container = connect<StateProps, DispatchProps>(
  (state: RootState) => ({
    region: state.purchase.dialogData!.region,
  }),
  (dispatch) => ({
    onCancel: () => dispatch(purchaseActions.reset()),
  }),
);

const AlreadyHaveStepWithData: React.ComponentType<{}> = container(AlreadyHaveStep);

export default AlreadyHaveStepWithData;
