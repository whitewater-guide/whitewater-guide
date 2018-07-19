import { connect } from 'react-redux';
import { RootState } from '../../core/reducers';
import { Region } from '../../ww-commons';
import { purchaseActions } from './index';

interface StateProps {
  canMakePayments: boolean;
}

interface DispatchProps {
  buyRegion: (region: Region, sectionId?: string) => void;
}

export type WithPremiumDialog = StateProps & DispatchProps;

export const connectPremiumDialog = connect<StateProps, DispatchProps, any>(
  (state: RootState) => ({
    canMakePayments: state.purchase.canMakePayments,
  }),
  { buyRegion: (region: Region, sectionId?: string) => purchaseActions.openDialog({ region, sectionId }) },
);
