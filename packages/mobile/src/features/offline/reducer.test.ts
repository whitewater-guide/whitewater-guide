import { offlineContentActions } from './actions';
import { offlineContentReducer } from './reducer';
import { OfflineContentStore } from './types';

it('should toggle dialog', () => {
  expect(
    offlineContentReducer(
      undefined,
      offlineContentActions.toggleDialog({ id: '11', name: 'Georgia' }),
    ),
  ).toEqual({
    dialogRegion: { id: '11', name: 'Georgia' },
    regionInProgress: null,
    progress: {},
    error: null,
  });
});

it('should set initial progress', () => {
  const state: OfflineContentStore = {
    dialogRegion: { id: '11', name: 'Georgia' },
    regionInProgress: '11',
    progress: {},
    error: null,
  };
  const action = offlineContentActions.updateProgress({
    data: [0, 10],
  });
  expect(offlineContentReducer(state, action)).toEqual({
    dialogRegion: { id: '11', name: 'Georgia' },
    regionInProgress: '11',
    progress: { data: [0, 10] },
    error: null,
  });
});

it('should update progress', () => {
  const state: OfflineContentStore = {
    dialogRegion: { id: '11', name: 'Georgia' },
    regionInProgress: '11',
    progress: {
      data: [0, 10],
      media: [10, 20],
    },
    error: null,
  };
  // test both array and number progress payloads
  const action = offlineContentActions.updateProgress({
    data: [7, 10],
    media: 13,
  });
  expect(offlineContentReducer(state, action)).toEqual({
    dialogRegion: { id: '11', name: 'Georgia' },
    regionInProgress: '11',
    progress: { data: [7, 10], media: [13, 20] },
    error: null,
  });
});

it('should reset on finish', () => {
  const state: OfflineContentStore = {
    dialogRegion: { id: '11', name: 'Georgia' },
    regionInProgress: null,
    progress: {},
    error: null,
  };
  const action = offlineContentActions.finishDownload();
  expect(offlineContentReducer(state, action)).toEqual({
    dialogRegion: null,
    regionInProgress: null,
    progress: {},
    error: null,
  });
});

it('should set non-fatal error', () => {
  const state: OfflineContentStore = {
    dialogRegion: { id: '11', name: 'Georgia' },
    regionInProgress: '11',
    progress: {
      data: [10, 100],
      media: [10, 100],
      maps: [10, 100],
    },
    error: null,
  };
  const action = offlineContentActions.failDownload({ message: 'error' });
  expect(offlineContentReducer(state, action)).toEqual({
    ...state,
    error: 'error',
  });
});

it('should set fatal error', () => {
  const state: OfflineContentStore = {
    dialogRegion: { id: '11', name: 'Georgia' },
    regionInProgress: '11',
    progress: {
      data: [10, 100],
      media: [10, 100],
      maps: [10, 100],
    },
    error: null,
  };
  const action = offlineContentActions.failDownload({
    message: 'error',
    fatal: true,
  });
  expect(offlineContentReducer(state, action)).toEqual({
    dialogRegion: { id: '11', name: 'Georgia' },
    regionInProgress: null,
    progress: {},
    error: 'error',
  });
});

it('should reset error when download restarted', () => {
  const state: OfflineContentStore = {
    dialogRegion: { id: '11', name: 'Georgia' },
    regionInProgress: null,
    progress: {},
    error: 'error',
  };
  const action = offlineContentActions.startDownload({
    regionId: '11',
    selection: { data: true, media: false, maps: false },
  });
  expect(offlineContentReducer(state, action)).toEqual({
    ...state,
    regionInProgress: '11',
    error: null,
  });
});
