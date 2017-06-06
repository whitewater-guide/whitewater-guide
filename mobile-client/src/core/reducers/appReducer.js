import { REHYDRATE } from 'redux-persist/constants';
import * as ActionTypes from '../actions/ActionTypes';

const inititalState = {
  initialized: false,
  rehydrated: false,
  drawerOpen: false,
};

export default function appReducer(state = inititalState, { type, payload }) {
  switch (type) {
    case ActionTypes.APP_STARTED:
      return { ...state, initialized: true };
    case ActionTypes.TOGGLE_DRAWER: {
      const drawerOpen = payload.isOpen === undefined ? !state.drawerOpen : payload.isOpen;
      return { ...state, drawerOpen };
    }
    case REHYDRATE:
      return { ...inititalState, initialized: false, rehydrated: true };
    default:
      return state;
  }
}
