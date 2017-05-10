import { SET_FILTER } from '../actions/ActionTypes';

const initialState = {
  searchString: '',
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_FILTER:
      return { ...state, ...payload };
    default:
      return state;
  }
};
