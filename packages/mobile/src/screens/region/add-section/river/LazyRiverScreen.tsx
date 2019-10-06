import React from 'react';
import registerScreen from '../../../../utils/registerScreen';

export const LazyRiverScreen = registerScreen({
  require: () => require('./RiverScreen'),
  navigationOptions: {
    headerTitle: 'screens:addSection.river.title',
  },
});
