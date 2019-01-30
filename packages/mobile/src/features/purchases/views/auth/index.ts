import { withMe } from '@whitewater-guide/clients';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { purchaseActions } from '../../actions';
import AuthStep from './AuthStep';
import { InnerProps, OuterProps } from './types';

const container = compose<InnerProps, OuterProps>(
  withMe,
  connect(
    undefined,
    (dispatch) => ({
      onContinue: () =>
        dispatch(purchaseActions.update({ dialogStep: 'BuyProduct' })),
      onCancel: () => dispatch(purchaseActions.reset()),
    }),
  ),
);

const AuthStepWithData: React.ComponentType<OuterProps> = container(AuthStep);

export default AuthStepWithData;
