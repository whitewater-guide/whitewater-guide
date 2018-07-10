import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { RootState } from '../../core/reducers';
import { purchaseActions } from '../../features/purchases';
import { Region } from '../../ww-commons';
import { InnerProps, OuterProps } from './types';

const container = compose<InnerProps, OuterProps>(
  translate(),
  connect(
    (state: RootState) => ({ regionsListRefreshToken: state.app.regionsListRefreshToken }),
    (dispatch) => ({
      buyPremium: (region: Region) => dispatch(purchaseActions.openDialog({ region })),
    }),
  ),
);

export default container;
