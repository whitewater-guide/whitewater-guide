import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withMe } from '../../../../ww-clients/features/users';
import { purchaseActions } from '../../actions';
import AuthStep from './AuthStep';

interface OuterProps {
  cancelable?: boolean;
}

const container = compose(
  withMe,
  connect(
    undefined,
    (dispatch) => ({
      onContinue: () => dispatch(purchaseActions.update({ dialogStep: 'BuyProduct' })),
      onCancel: () => dispatch(purchaseActions.reset()),
    }),
  ),
);

const AuthStepWithData: React.ComponentType<OuterProps> = container(AuthStep);

export default AuthStepWithData;
