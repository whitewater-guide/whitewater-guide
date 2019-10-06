import { createSelector } from 'reselect';
import { RootState } from '../../core/redux/reducers';
import { OfflineContentStore } from './types';

const offlineContent = (state: RootState) => state.offlineContent;

const dialogState = createSelector(
  offlineContent,
  (state: OfflineContentStore) => ({
    region: state.dialogRegion,
    inProgress:
      !!state.dialogRegion && state.dialogRegion.id === state.regionInProgress,
    progress: state.progress,
    error: state.error,
  }),
);

export const offlineContentSelectors = {
  dialogState,
};
