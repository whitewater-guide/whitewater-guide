import React from 'react';
import registerScreen from '../../../../utils/registerScreen';
import TabBarLabel from '../TabBarLabel';

export const LazyPhotosScreen = registerScreen({
  require: () => require('./PhotosScreen'),
  navigationOptions: {
    tabBarLabel: (props: any) => (
      <TabBarLabel {...props} i18nKey="screens:addSection.tabs.photos" />
    ),
  },
});
