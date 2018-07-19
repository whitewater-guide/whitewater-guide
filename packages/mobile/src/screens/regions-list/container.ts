import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { RootState } from '../../core/reducers';
import { connectPremiumDialog } from '../../features/purchases';
import { InnerProps, OuterProps } from './types';

const container = compose<InnerProps, OuterProps>(
  translate(),
  connectPremiumDialog,
  connect(
    (state: RootState) => ({
      regionsListRefreshToken: state.app.regionsListRefreshToken,
    }),
  ),
);

export default container;
