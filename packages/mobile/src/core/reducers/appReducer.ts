import { Action } from 'typescript-fsa';
import { appStarted, refreshRegionsList } from '../actions';

export interface AppState {
  initialized: boolean;
  regionsListRefreshToken: number;
}

const initialState: AppState = {
  initialized: false,
  regionsListRefreshToken: 1, // Used to refresh RN FlatList via extraData
};

export function appReducer(
  state: AppState = initialState,
  action: Action<any>,
) {
  const { type, payload } = action;
  switch (type) {
    case appStarted.type:
      return { ...state, initialized: true };
    case refreshRegionsList.type:
      return {
        ...state,
        regionsListRefreshToken: state.regionsListRefreshToken + 1,
      };
    default:
      return state;
  }
}
