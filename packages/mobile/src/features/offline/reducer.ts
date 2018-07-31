import { AnyAction, isType } from 'typescript-fsa';
import { offlineContentActions } from './actions';
import { OfflineContentStore } from './types';

const initialState: OfflineContentStore = {
  dialogRegion: null,
  regionInProgress: null,
  progress: {},
};

export const offlineContentReducer = (state = initialState, action: AnyAction) => {
  if (isType(action, offlineContentActions.toggleDialog)) {
    return {
      ...state,
      dialogRegion: action.payload,
    };
  }

  if (isType(action, offlineContentActions.updateProgress)) {
    const { regionInProgress, ...progress } = action.payload;
    return { ...state, regionInProgress, progress: { ...state.progress, ...progress } };
  }

  if (isType(action, offlineContentActions.finishDownload)) {
    return { ...state, progress: {}, regionInProgress: null };
  }

  return state;
};

// re-export
export { OfflineContentStore } from './types';
