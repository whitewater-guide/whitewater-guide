import { Action } from 'typescript-fsa';
import { refreshRegionsList } from '../actions';

export interface AppState {
  regionsListRefreshToken: number;
}

const initialState: AppState = {
  regionsListRefreshToken: 1, // Used to refresh RN FlatList via extraData
};

export function appReducer(
  state: AppState = initialState,
  action: Action<any>,
) {
  const { type, payload } = action;
  switch (type) {
    case refreshRegionsList.type:
      return {
        ...state,
        regionsListRefreshToken: state.regionsListRefreshToken + 1,
      };
    default:
      return state;
  }
}
