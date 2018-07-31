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
    summary: null,
  });
});

it('should update progress', () => {
  const state: OfflineContentStore = {
    dialogRegion: { id: '11', name: 'Georgia' },
    regionInProgress: null,
    progress: {},
    summary: null,
  };
  const action = offlineContentActions.updateProgress({
    regionInProgress: '11',
    data: [0, 10],
  });
  expect(offlineContentReducer(state, action)).toEqual({
    dialogRegion: { id: '11', name: 'Georgia' },
    regionInProgress: '11',
    progress: { data: [0, 10] },
    summary: null,
  });
});

it('should update media summary', () => {
  const state: OfflineContentStore = {
    dialogRegion: { id: '11', name: 'Georgia' },
    regionInProgress: null,
    progress: {},
    summary: null,
  };
  const action = offlineContentActions.updateSummary({
    photo: {
      count: 10,
      size: 12345678,
    },
    video: {
      count: 10,
      size: 12345678,
    },
    blog: {
      count: 10,
      size: 12345678,
    },
  });

  expect(offlineContentReducer(state, action)).toEqual({
    dialogRegion: { id: '11', name: 'Georgia' },
    regionInProgress: null,
    progress: {},
    summary: {
      photo: {
        count: 10,
        size: 12345678,
      },
      video: {
        count: 10,
        size: 12345678,
      },
      blog: {
        count: 10,
        size: 12345678,
      },
    },
  });
});

it('should reset on finish', () => {
  const state: OfflineContentStore = {
    dialogRegion: null,
    regionInProgress: null,
    progress: {},
    summary: {
      photo: {
        count: 10,
        size: 12345678,
      },
      video: {
        count: 10,
        size: 12345678,
      },
      blog: {
        count: 10,
        size: 12345678,
      },
    },
  };
  const action = offlineContentActions.finishDownload();
  expect(offlineContentReducer(state, action)).toEqual({
    dialogRegion: null,
    regionInProgress: null,
    progress: {},
    summary: null,
  });
});