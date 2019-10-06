import React from 'react';
import registerScreen from '../../utils/registerScreen';
import ResetFilterButton from './ResetFilterButton';

export const LazyFilterScreen = registerScreen({
  require: () => require('./FilterScreen'),
  navigationOptions: {
    headerTitle: 'filter:title',
    headerRight: <ResetFilterButton />,
  },
});
