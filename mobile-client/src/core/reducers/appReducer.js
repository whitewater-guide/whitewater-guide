import { REHYDRATE } from 'redux-persist/constants';
import * as ActionTypes from '../actions/ActionTypes';

const inititalState = {
  initialized: false,
  rehydrated: false,
};

export default function appReducer(state = inititalState, { type, payload }) {
  switch (type) {
    case ActionTypes.APP_STARTED:
      return { ...state, initialized: true };
    case REHYDRATE:
      return payload.app ? { ...state, ...payload.app, initialized: false, rehydrated: true } : state;
    default:
      return state;
  }
}
