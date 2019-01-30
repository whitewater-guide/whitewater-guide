import get from 'lodash/get';
import { AnyAction, isType } from 'typescript-fsa';
import { offlineContentActions } from './actions';
import {
  OfflineContentStore,
  OfflineProgress,
  OfflineProgressPayload,
} from './types';

const initialState: OfflineContentStore = {
  dialogRegion: null,
  regionInProgress: null,
  progress: {},
};

function updateProgress(
  progress: OfflineProgress,
  payload: OfflineProgressPayload,
): OfflineProgress {
  return Object.entries(payload).reduce((result, [key, entry]) => {
    if (Array.isArray(entry)) {
      return { ...result, [key]: entry };
    } else {
      return { ...result, [key]: [entry, get(result, [key, 1], 0)] };
    }
  }, progress);
}

export const offlineContentReducer = (
  state = initialState,
  action: AnyAction,
) => {
  if (isType(action, offlineContentActions.toggleDialog)) {
    return {
      ...state,
      dialogRegion: action.payload,
    };
  }

  if (isType(action, offlineContentActions.updateProgress)) {
    const { regionInProgress, ...progress } = action.payload;
    return {
      ...state,
      regionInProgress:
        regionInProgress === undefined
          ? state.regionInProgress
          : regionInProgress,
      progress: updateProgress(state.progress, progress),
    };
  }

  if (isType(action, offlineContentActions.finishDownload)) {
    return { dialogRegion: null, progress: {}, regionInProgress: null };
  }

  return state;
};

// re-export
export { OfflineContentStore } from './types';
