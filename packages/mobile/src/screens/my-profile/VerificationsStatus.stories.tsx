import { storiesOf } from '@storybook/react-native';
import React from 'react';
import Paper from '~/components/Paper';
import { VerificationStatusInternal } from './VerificationStatus';

storiesOf('VerificationStatus', module)
  .addDecorator((story: any) => <Paper gutterBottom={true}>{story()}</Paper>)
  .add('verified', () => <VerificationStatusInternal isVerified={true} />)
  .add('unverified', () => <VerificationStatusInternal isVerified={false} />);
