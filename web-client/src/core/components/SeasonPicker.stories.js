import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { muiTheme } from 'storybook-addon-material-ui';
import SeasonPicker from './SeasonPicker';

storiesOf('SeasonPicker', module)
  .addDecorator(muiTheme())
  .add('empty', () => (
    <SeasonPicker onChange={action('change')} />
  ))
  .add('with some selections', () => (
    <SeasonPicker value={[2, 13]} onChange={action('change')} />
  ));