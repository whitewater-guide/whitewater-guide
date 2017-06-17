import { Platform } from 'react-native';
import * as ActionTypes from '../actions/ActionTypes';

const MAP_TYPES = ['standard', 'satellite', 'hybrid'];
if (Platform.OS === 'android') {
  MAP_TYPES.push('terrain');
}

const initialState = {
  mapType: 'standard',
};

export default function settingsReducer(state = initialState, { type, payload }) {
  switch (type) {
    case ActionTypes.TOGGLE_MAP_TYPE: {
      let mapType = payload.mapType;
      if (!mapType || MAP_TYPES.indexOf(mapType) === -1) {
        mapType = MAP_TYPES[(MAP_TYPES.indexOf(state.mapType) + 1) % MAP_TYPES.length];
      }
      return { ...state, mapType };
    }
    default:
      return state;
  }
}
