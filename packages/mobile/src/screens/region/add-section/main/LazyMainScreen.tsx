import React from 'react';
import registerScreen from '../../../../utils/registerScreen';
import TabBarLabel from '../TabBarLabel';

export const LazyMainScreen = registerScreen({
  require: () => require('./MainScreen'),
  navigationOptions: {
    tabBarLabel: (props: any) => (
      <TabBarLabel {...props} i18nKey="screens:addSection.tabs.main" />
    ),
  },
});
