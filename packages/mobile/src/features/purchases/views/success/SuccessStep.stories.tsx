// @ts-ignore
import { storiesOf } from '@storybook/react-native';
import noop from 'lodash/noop';
import React from 'react';
import { Dialog } from 'react-native-paper';
import { PremiumRegion } from '../../types';
import DialogBody from '../DialogBody';
import SuccessStep from './SuccessStep';

const region: PremiumRegion = {
  id: '1111',
  name: 'Georgia',
  sku: 'region.georgia',
};

storiesOf('Premium dialog: success step')
  .addDecorator((story: any) => (
    <Dialog onDismiss={noop} visible dismissable={false}>
      <DialogBody title="Get Georgia premium">
        {story()}
      </DialogBody>
    </Dialog>
  ))
  .add('Default', () => (
    <SuccessStep
      region={region}
    />
  ));
