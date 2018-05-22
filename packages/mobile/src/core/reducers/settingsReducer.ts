import { Action } from 'redux';
import { isType } from 'typescript-fsa';
import { settings } from '../actions';

export const enum MessagingPermission {
  UNKNOWN = 1,
  ENABLED = 2,
  DISABLED = 3,
}

export interface SettingsState {
  messaging: MessagingPermission;
}

const initialState: SettingsState = {
  messaging: MessagingPermission.UNKNOWN,
};

export function settingsReducer(state: SettingsState = initialState, action: Action) {
  if (isType(action, settings.setMessaging)) {
    return { ...state, messaging: action.payload };
  }
  return state;
}
