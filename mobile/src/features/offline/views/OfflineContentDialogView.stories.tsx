import { storiesOf } from '@storybook/react-native';
import { NamedNode } from '@whitewater-guide/commons';
import React from 'react';

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

const error = new Error();

storiesOf('Offline dialog', module)
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
      error={error}
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
      error={error}
    />
  ));
