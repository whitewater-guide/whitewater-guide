import { actionCreatorFactory } from 'typescript-fsa';
import { NamedNode } from '../../ww-commons';
import { OfflineCategorySelection, OfflineProgressPayload } from './types';

const factory = actionCreatorFactory('OFFLINE_CONTENT');

export const offlineContentActions = {
  toggleDialog: factory<NamedNode | null>('TOGGLE_DIALOG'),
  updateProgress: factory<OfflineProgressPayload>('UPDATE_PROGRESS'),
  startDownload: factory<OfflineCategorySelection>('START_DOWNLOAD'),
  finishDownload: factory('FINISH_DOWNLOAD'),
};
