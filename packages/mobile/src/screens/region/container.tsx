import { withSearchTerms } from '@whitewater-guide/clients';
import React from 'react';
import { withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import { compose, pure } from 'recompose';
import { RootState } from '../../core/redux/reducers';
import { InnerProps, OuterProps } from './types';

const container = compose<InnerProps, OuterProps>(
  pure,
  connect((state: RootState) => ({ isConnected: state.network.isConnected })),
  withApollo,
  withSearchTerms,
);

export default container;
