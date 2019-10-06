import React from 'react';
import registerScreen from '../../../../utils/registerScreen';
import DoneButton from './DoneButton';

export const LazyShapeScreen = registerScreen({
  require: () => require('./ShapeScreen'),
  navigationOptions: {
    headerTitle: 'screens:addSection.shape.title',
    headerRight: <DoneButton />,
  },
});
