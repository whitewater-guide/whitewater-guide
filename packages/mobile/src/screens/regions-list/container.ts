import { withTranslation } from 'react-i18next';
import { withNavigationFocus } from 'react-navigation';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { RootState } from '../../core/reducers';
import { offlineContentActions } from '../../features/offline';
import { connectPremiumDialog } from '../../features/purchases';
import { InnerProps, OuterProps } from './types';

const container = compose<InnerProps, OuterProps>(
  withNavigationFocus,
  withTranslation(),
  connectPremiumDialog,
  connect(
    (state: RootState) => ({
      regionsListRefreshToken: state.app.regionsListRefreshToken,
      regionInProgress: state.offlineContent.regionInProgress,
    }),
    {
      openDownloadDialog: offlineContentActions.toggleDialog,
    },
  ),
);

export default container;
