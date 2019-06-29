import { NamedNode } from '@whitewater-guide/commons';
import { actionCreatorFactory } from 'typescript-fsa';
import {
  OfflineContentError,
  OfflineProgressPayload,
  StartDownloadPayload,
} from './types';

const factory = actionCreatorFactory('OFFLINE_CONTENT');

export const offlineContentActions = {
  toggleDialog: factory<NamedNode | null>('TOGGLE_DIALOG'),
  updateProgress: factory<OfflineProgressPayload>('UPDATE_PROGRESS'),
  startDownload: factory<StartDownloadPayload>('START_DOWNLOAD'),
  finishDownload: factory('FINISH_DOWNLOAD'),
  failDownload: factory<OfflineContentError>('FAIL_DOWNLOAD'),
};

type Dispatchers = typeof offlineContentActions;
type DispatchersNames = keyof Dispatchers;

export type OfflineContentAction = ReturnType<Dispatchers[DispatchersNames]>;
