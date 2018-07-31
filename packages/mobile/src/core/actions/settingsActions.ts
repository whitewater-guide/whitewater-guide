import { actionCreatorFactory } from 'typescript-fsa';
import { MessagingPermission } from '../reducers/settingsReducer';

const factory = actionCreatorFactory('SETTINGS');

export const setMessaging = factory<MessagingPermission>('MESSAGING');
export const setMapType = factory<string>('MAP_TYPE');

export const settings = {
  setMessaging,
  setMapType,
};
