import { action } from '@storybook/addon-actions';

// @ts-ignore
import { storiesOf } from '@storybook/react-native';
import noop from 'lodash/noop';
import React from 'react';
import { Dialog } from 'react-native-paper';
import { NamedNode } from '../../ww-commons/core';
import { RegionMediaSummary } from '../../ww-commons/features/regions';
import OfflineDialogView from './OfflineDialogView';
import { OfflineProgress } from './types';

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

storiesOf('Offline dialog')
  .addDecorator((story: any) => (
    <Dialog onDismiss={noop} visible dismissable={false}>
      {story()}
    </Dialog>
  ))
  .add('Offline', () => (
    <OfflineDialogView region={region} progress={progress} isConnected={false} />
  ))
  .add('Loading summary', () => (
    <OfflineDialogView region={region} progress={progress} isLoadingSummary />
  ))
  .add('Ready', () => (
    <OfflineDialogView
      region={region}
      progress={progress}
      summary={summary}
      onDismiss={action('Dismiss')}
      onDownload={action('Download')}
    />
  ))
  .add('In progress (full)', () => (
    <OfflineDialogView region={region} progress={progress} summary={summary} inProgress />
  ))
  .add('In progress (partial)', () => (
    <OfflineDialogView region={region} progress={progressPartial} summary={summary} inProgress />
  ));
