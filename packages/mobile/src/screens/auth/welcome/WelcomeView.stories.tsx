import { storiesOf } from '@storybook/react-native';
import React from 'react';
import { WelcomeView } from './WelcomeView';

storiesOf('WelcomeView', module)
  .add('Verified', () => <WelcomeView verified={true} />)
  .add('Unverified', () => <WelcomeView verified={false} />);
