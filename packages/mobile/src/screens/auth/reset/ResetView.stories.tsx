import { storiesOf } from '@storybook/react-native';
import React from 'react';
import { ResetView } from './ResetView';

storiesOf('ResetView', module)
  .add('Default', () => <ResetView id="11" token="22" />)
  .add('Missing param', () => <ResetView id="11" token="" />);
