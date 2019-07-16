import get from 'lodash/get';
import { isType } from 'typescript-fsa';
import { OfflineContentAction, offlineContentActions } from './actions';
import {
  OfflineContentStore,
  OfflineProgress,
  OfflineProgressPayload,
} from './types';

const initialState: OfflineContentStore = {
  dialogRegion: null,
  regionInProgress: null,
  progress: {},
  error: null,
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
  action: OfflineContentAction,
): OfflineContentStore => {
  if (isType(action, offlineContentActions.toggleDialog)) {
    return {
      ...state,
      dialogRegion: action.payload,
      error: null,
    };
  }

  if (isType(action, offlineContentActions.startDownload)) {
    return {
      ...state,
      regionInProgress: action.payload.regionId,
      error: null,
    };
  }

  if (isType(action, offlineContentActions.updateProgress)) {
    return {
      ...state,
      progress: updateProgress(state.progress, action.payload),
    };
  }

  if (isType(action, offlineContentActions.failDownload)) {
    const { message, fatal } = action.payload;
    if (!fatal) {
      return { ...state, error: message };
    }
    return {
      ...state,
      progress: {},
      regionInProgress: null,
      error: message,
    };
  }

  if (isType(action, offlineContentActions.finishDownload)) {
    return {
      dialogRegion: null,
      progress: {},
      regionInProgress: null,
      error: null,
    };
  }

  return state;
};
