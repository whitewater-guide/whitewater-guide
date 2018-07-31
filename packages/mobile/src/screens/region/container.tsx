import React from 'react';
import { withApollo } from 'react-apollo';
import { withNetworkConnectivity } from 'react-native-offline';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { RootState } from '../../core/reducers';
import { InnerProps, OuterProps } from './types';

const container = compose<InnerProps, OuterProps>(
  connect((state: RootState) => ({ isConnected: state.network.isConnected })),
  withApollo,
);

export default container;
