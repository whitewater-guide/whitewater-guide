import { actionCreatorFactory } from 'typescript-fsa';
import { NamedNode, RegionMediaSummary } from '../../ww-commons';
import { OfflineProgressPayload } from './types';

const factory = actionCreatorFactory('OFFLINE_CONTENT');

export const offlineContentActions = {
  toggleDialog: factory<NamedNode | null>('TOGGLE_DIALOG'),
  updateProgress: factory<OfflineProgressPayload>('UPDATE_PROGRESS'),
  updateSummary: factory<RegionMediaSummary | null>('UPDATE_SUMMARY'),
};
