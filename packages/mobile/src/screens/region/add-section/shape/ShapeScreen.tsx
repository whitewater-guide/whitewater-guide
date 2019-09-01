import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { Screen } from '../../../../components';
import DoneButton from './DoneButton';
import PiToField from './PiToField';

export const ShapeScreen: NavigationScreenComponent = () => {
  return (
    <Screen>
      <PiToField />
    </Screen>
  );
};

ShapeScreen.displayName = 'ShapeScreen';
ShapeScreen.navigationOptions = {
  headerTitle: 'screens:addSection.shape.title',
  headerRight: <DoneButton />,
};
