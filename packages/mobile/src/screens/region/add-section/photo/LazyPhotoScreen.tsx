import React from 'react';
import registerScreen from '../../../../utils/registerScreen';
import BackButton from './BackButton';

export const LazyPhotoScreen = registerScreen({
  require: () => require('./PhotoScreen'),
  navigationOptions: {
    title: 'screens:addSection.photo.title',
    headerLeft: null,
    headerRight: <BackButton />,
  },
});
