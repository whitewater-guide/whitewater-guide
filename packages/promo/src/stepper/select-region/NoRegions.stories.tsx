import Paper from '@material-ui/core/Paper';
import { storiesOf } from '@storybook/react';
import React from 'react';

import NoRegions from './NoRegions';

storiesOf('NoRegions', module)
  .addDecorator((story) => (
    <div style={{ width: 400 }}>
      <Paper style={{ padding: 8 }}>{story()}</Paper>
    </div>
  ))
  .add('default', () => {
    return <NoRegions />;
  });
