// @ts-ignore
import { storiesOf } from '@storybook/react-native';
import noop from 'lodash/noop';
import React from 'react';
import { Dialog } from 'react-native-paper';
import { PremiumRegion } from '../../types';
import DialogBody from '../DialogBody';
import AlreadyHaveStep from './AlreadyHaveStep';

const region: PremiumRegion = {
  id: '1111',
  name: 'Georgia',
  sku: 'region.georgia',
};

storiesOf('Premium dialog: already have step')
  .addDecorator((story: any) => (
    <Dialog onDismiss={noop} visible dismissable={false}>
      <DialogBody title="Get Georgia premium">
        {story()}
      </DialogBody>
    </Dialog>
  ))
  .add('Default', () => (
    <AlreadyHaveStep
      region={region}
    />
  ));
