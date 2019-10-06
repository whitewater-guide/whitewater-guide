import React from 'react';
import registerScreen from '../../utils/registerScreen';

export const LazyMyProfileScreen = registerScreen({
  require: () => require('./MyProfileScreen'),
  navigationOptions: {
    headerTitle: 'myProfile:title',
  },
});
