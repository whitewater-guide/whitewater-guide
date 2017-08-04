import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { withState } from 'recompose';
import { muiTheme } from 'storybook-addon-material-ui';
import DifficultyPicker from './DifficultyPicker';

const Picker = withState('value', 'onChange', [])(DifficultyPicker);

storiesOf('DifficultyPicker', module)
  .addDecorator(muiTheme())
  .add('empty', () => (
    <Picker />
  ));
