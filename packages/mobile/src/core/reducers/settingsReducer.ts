import { Action } from 'redux';
import { isType } from 'typescript-fsa';
import { settings } from '../actions';

export enum MessagingPermission {
  UNKNOWN = 1,
  ENABLED = 2,
  DISABLED = 3,
}

export interface SettingsState {
  messaging: MessagingPermission;
  mapType?: string;
}

const initialState: SettingsState = {
  messaging: MessagingPermission.UNKNOWN,
  mapType: 'standard',
};

export function settingsReducer(
  state: SettingsState = initialState,
  action: Action,
) {
  if (isType(action, settings.setMessaging)) {
    return { ...state, messaging: action.payload };
  }
  if (isType(action, settings.setMapType)) {
    return { ...state, mapType: action.payload };
  }
  return state;
}
