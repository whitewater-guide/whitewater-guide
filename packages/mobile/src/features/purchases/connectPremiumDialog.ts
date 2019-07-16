import { Region } from '@whitewater-guide/commons';
import { connect } from 'react-redux';
import { RootState } from '../../core/redux/reducers';
import { purchaseActions } from './index';

interface StateProps {
  canMakePayments: boolean;
}

interface DispatchProps {
  buyRegion: (region: Region, sectionId?: string) => void;
}

export type WithPremiumDialog = StateProps & DispatchProps;

export const connectPremiumDialog = connect<
  StateProps,
  DispatchProps,
  any,
  RootState
>(
  (state: RootState) => ({
    canMakePayments: state.purchase.canMakePayments,
  }),
  {
    buyRegion: (region: Region, sectionId?: string) =>
      purchaseActions.openDialog({ region, sectionId }),
  },
);
