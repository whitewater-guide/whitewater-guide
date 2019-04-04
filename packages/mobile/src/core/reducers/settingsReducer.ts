import { Action } from 'redux';
import { isType } from 'typescript-fsa';
import { settings } from '../actions';

export interface SettingsState {
  mapType?: string;
}

const initialState: SettingsState = {
  mapType: 'standard',
};

export function settingsReducer(
  state: SettingsState = initialState,
  action: Action,
) {
  if (isType(action, settings.setMapType)) {
    return { ...state, mapType: action.payload };
  }
  return state;
}
