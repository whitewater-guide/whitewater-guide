import { storiesOf } from '@storybook/react-native';
import { NamedNode, RegionMediaSummary } from '@whitewater-guide/commons';
import { ApolloError } from 'apollo-client';
import noop from 'lodash/noop';
import React from 'react';
import { Dialog } from 'react-native-paper';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { OfflineProgress } from '../types';
import OfflineContentDialogView from './OfflineContentDialogView';

const region: NamedNode = {
  id: '1111',
  name: 'Georgia',
};

const progress: OfflineProgress = {
  data: [7, 11],
  media: [0, 100],
  maps: [0, 100],
};

const progressPartial: OfflineProgress = {
  data: [7, 11],
};

const progressPartial2: OfflineProgress = {
  data: [7, 11],
  maps: [22, 100],
};

const summary: RegionMediaSummary = {
  photo: {
    count: 33,
    size: 12345678,
  },
  video: {
    count: 33,
    size: 12345678,
  },
  blog: {
    count: 33,
    size: 12345678,
  },
  maps: {
    count: 0,
    size: 123456789,
  },
};

const store = createStore(() => ({ offlineContent: {} }));

storiesOf('Offline dialog', module)
  .addDecorator((story: any) => (
    <Provider store={store}>
      <Dialog onDismiss={noop} visible={true} dismissable={false}>
        {story()}
      </Dialog>
    </Provider>
  ))
  .add('Loading summary', () => (
    <OfflineContentDialogView
      summary={{ summary, loading: true }}
      region={region}
      progress={progress}
    />
  ))
  .add('Loading summary error', () => (
    <OfflineContentDialogView
      summary={{
        summary: null,
        loading: false,
        error: new ApolloError({ errorMessage: 'Error' }),
      }}
      region={region}
      progress={progress}
    />
  ))
  .add('Ready', () => (
    <OfflineContentDialogView
      region={region}
      progress={progress}
      summary={{ summary }}
    />
  ))
  .add('Error', () => (
    <OfflineContentDialogView
      region={region}
      progress={progress}
      summary={{ summary }}
      error="offline:dialog.mapsError"
    />
  ))
  .add('In progress (full)', () => (
    <OfflineContentDialogView
      inProgress={true}
      region={region}
      progress={progress}
      summary={{ summary }}
    />
  ))
  .add('In progress (partial, first)', () => (
    <OfflineContentDialogView
      inProgress={true}
      region={region}
      progress={progressPartial}
      summary={{ summary }}
    />
  ))
  .add('In progress (partial, no photos)', () => (
    <OfflineContentDialogView
      inProgress={true}
      region={region}
      progress={progressPartial2}
      summary={{ summary }}
    />
  ))
  .add('In progress (maps error)', () => (
    <OfflineContentDialogView
      inProgress={true}
      region={region}
      progress={progressPartial2}
      summary={{ summary }}
      error="offline:dialog.mapsError"
    />
  ));
