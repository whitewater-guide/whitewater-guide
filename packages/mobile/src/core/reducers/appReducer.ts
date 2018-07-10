import { Action } from 'typescript-fsa';
import { appStarted, refreshRegionsList, toggleDrawer } from '../actions';

export interface AppState {
  initialized: boolean;
  drawerOpen: boolean;
  regionsListRefreshToken: number;
}

const initialState: AppState = {
  initialized: false,
  drawerOpen: false,
  regionsListRefreshToken: 1, // Used to refresh RN FlatList via extraData
};

export function appReducer(state: AppState = initialState, action: Action<any>) {
  const { type, payload } = action;
  switch (type) {
    case appStarted.type:
      return { ...state, initialized: true };
    case refreshRegionsList.type:
      return { ...state, regionsListRefreshToken: state.regionsListRefreshToken + 1 };
    case toggleDrawer.type:
      const drawerOpen = payload === null ? !state.drawerOpen : !!payload;
      return { ...state, drawerOpen };
    default:
      return state;
  }
}
