import { offlineContentActions } from './actions';
import { offlineContentReducer } from './reducer';
import { OfflineContentStore } from './types';

it('should toggle dialog', () => {
  expect(offlineContentReducer(
    undefined,
    offlineContentActions.toggleDialog({ id: '11', name: 'Georgia' }),
  )).toEqual({
    dialogRegion: { id: '11', name: 'Georgia' },
    regionInProgress: null,
    progress: {},
  });
});

it('should set initial progress', () => {
  const state: OfflineContentStore = {
    dialogRegion: { id: '11', name: 'Georgia' },
    regionInProgress: null,
    progress: {},
  };
  const action = offlineContentActions.updateProgress({
    regionInProgress: '11',
    data: [0, 10],
  });
  expect(offlineContentReducer(state, action)).toEqual({
    dialogRegion: { id: '11', name: 'Georgia' },
    regionInProgress: '11',
    progress: { data: [0, 10] },
  });
});

it('should update progress', () => {
  const state: OfflineContentStore = {
    dialogRegion: { id: '11', name: 'Georgia' },
    regionInProgress: '11',
    progress: {
      data: [0, 10],
    },
  };
  const action = offlineContentActions.updateProgress({ data: [7, 10] });
  expect(offlineContentReducer(state, action)).toEqual({
    dialogRegion: { id: '11', name: 'Georgia' },
    regionInProgress: '11',
    progress: { data: [7, 10] },
  });
});

it('should reset on finish', () => {
  const state: OfflineContentStore = {
    dialogRegion: { id: '11', name: 'Georgia' },
    regionInProgress: null,
    progress: {},
  };
  const action = offlineContentActions.finishDownload();
  expect(offlineContentReducer(state, action)).toEqual({
    dialogRegion: null,
    regionInProgress: null,
    progress: {},
  });
});
