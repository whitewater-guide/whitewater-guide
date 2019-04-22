import { actionCreatorFactory } from 'typescript-fsa';

const factory = actionCreatorFactory('SETTINGS');

export const setMapType = factory<string>('MAP_TYPE');

export const settings = {
  setMapType,
};
