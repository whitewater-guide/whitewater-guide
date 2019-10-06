import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { ResetView } from './ResetView';
import { ResetParams } from './types';

const ResetScreen: NavigationScreenComponent<ResetParams> = ({
  navigation,
}) => (
  <ResetView
    id={navigation.getParam('id')}
    token={navigation.getParam('token')}
  />
);

export default ResetScreen;
