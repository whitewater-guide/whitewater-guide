import { updateSettings } from './actions';
import { AppSettings, DEFAULT_APP_SETTINGS } from './types';

type Action = ReturnType<typeof updateSettings>;

export const appSettingsReducer = (
  state = DEFAULT_APP_SETTINGS,
  action: Action,
): AppSettings => {
  switch (action.type) {
    case updateSettings.type:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
