import { storiesOf } from '@storybook/react-native';
import { NamedNode } from '@whitewater-guide/commons';
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
    <OfflineContentDialogView region={region} progress={progress} />
  ))
  .add('Loading summary error', () => (
    <OfflineContentDialogView region={region} progress={progress} />
  ))
  .add('Ready', () => (
    <OfflineContentDialogView region={region} progress={progress} />
  ))
  .add('Error', () => (
    <OfflineContentDialogView
      region={region}
      progress={progress}
      error="offline:dialog.mapsError"
    />
  ))
  .add('In progress (full)', () => (
    <OfflineContentDialogView
      inProgress={true}
      region={region}
      progress={progress}
    />
  ))
  .add('In progress (partial, first)', () => (
    <OfflineContentDialogView
      inProgress={true}
      region={region}
      progress={progressPartial}
    />
  ))
  .add('In progress (partial, no photos)', () => (
    <OfflineContentDialogView
      inProgress={true}
      region={region}
      progress={progressPartial2}
    />
  ))
  .add('In progress (maps error)', () => (
    <OfflineContentDialogView
      inProgress={true}
      region={region}
      progress={progressPartial2}
      error="offline:dialog.mapsError"
    />
  ));
