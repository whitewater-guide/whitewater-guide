import { actionCreatorFactory } from 'typescript-fsa';
import { MessagingPermission } from '../reducers/settingsReducer';

const factory = actionCreatorFactory('SETTINGS');

export const setMessaging = factory<MessagingPermission>('MESSAGING');

export const settings = {
  setMessaging,
};
