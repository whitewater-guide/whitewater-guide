import { Action } from 'typescript-fsa';
import { appStarted, toggleDrawer } from '../actions';

export interface AppState {
  initialized: boolean;
  drawerOpen: boolean;
}

const initialState: AppState = {
  initialized: false,
  drawerOpen: false,
};

export function appReducer(state: AppState = initialState, action: Action<any>) {
  const { type, payload } = action;
  switch (type) {
    case appStarted.type:
      return { ...state, initialized: true };
    case toggleDrawer.type:
      const drawerOpen = payload === null ? !state.drawerOpen : !!payload;
      return { ...state, drawerOpen };
    default:
      return state;
  }
}
