import { Screen } from 'components/Screen';
import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import PiToField from './PiToField';

const ShapeScreen: NavigationScreenComponent = () => {
  return (
    <Screen>
      <PiToField />
    </Screen>
  );
};

ShapeScreen.displayName = 'ShapeScreen';

export default ShapeScreen;
