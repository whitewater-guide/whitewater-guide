import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { muiTheme } from 'storybook-addon-material-ui';
import GoogleMap from './GoogleMap';

storiesOf('GoogleMap', module)
  .addDecorator(muiTheme())
  .add('basic', () => (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
      <GoogleMap />
    </div>
  ));
