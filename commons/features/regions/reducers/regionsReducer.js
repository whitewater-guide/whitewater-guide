import { SELECT_REGION, UPDATE_REGION } from '../actions';
import regionReducer from './regionReducer';

export default (state = {}, action) => {
  const { type, payload } = action;
  const regionId = payload ? payload.regionId : null;
  const key = regionId || 'all';
  switch (type) {
    case SELECT_REGION:
    case UPDATE_REGION:
      return { ...state, [key]: regionReducer(regionId)(state[key], action) };
    default:
      return state;
  }
};
