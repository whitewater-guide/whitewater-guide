import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import AnonView from './AnonView';

storiesOf('AnonView', module)
  .addDecorator(story => (
    <div style={{ width: 400 }}>
      {story()}
    </div>
  ))
  .add('default', () => (
    <AnonView login={action('login')}/>
  ));
