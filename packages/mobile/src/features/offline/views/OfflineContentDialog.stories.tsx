import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import { NamedNode, RegionMediaSummary } from '@whitewater-guide/commons';
import { ApolloError } from 'apollo-client';
import noop from 'lodash/noop';
import React from 'react';
import { Dialog } from 'react-native-paper';
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
};

storiesOf('Offline dialog', module)
  .addDecorator((story: any) => (
    <Dialog onDismiss={noop} visible={true} dismissable={false}>
      {story()}
    </Dialog>
  ))
  .add('Offline', () => (
    <OfflineContentDialogView
      region={region}
      progress={progress}
      isConnected={false}
      summary={{ summary }}
    />
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
        summary,
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
      onDismiss={action('Dismiss')}
      onDownload={action('Download')}
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
  .add('In progress (partial)', () => (
    <OfflineContentDialogView
      inProgress={true}
      region={region}
      progress={progressPartial}
      summary={{ summary }}
    />
  ));
