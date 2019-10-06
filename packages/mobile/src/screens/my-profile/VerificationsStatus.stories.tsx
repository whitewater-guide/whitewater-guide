import { storiesOf } from '@storybook/react-native';
import Paper from 'components/Paper';
import React from 'react';
import { VerificationStatusInternal } from './VerificationStatus';

storiesOf('VerificationStatus', module)
  .addDecorator((story: any) => <Paper gutterBottom={true}>{story()}</Paper>)
  .add('verified', () => <VerificationStatusInternal isVerified={true} />)
  .add('unverified', () => <VerificationStatusInternal isVerified={false} />);
