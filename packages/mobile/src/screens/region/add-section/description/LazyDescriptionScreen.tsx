import React from 'react';
import registerScreen from '../../../../utils/registerScreen';
import TabBarLabel from '../TabBarLabel';

export const LazyDescriptionScreen = registerScreen({
  require: () => require('./DescriptionScreen'),
  navigationOptions: {
    tabBarLabel: (props: any) => (
      <TabBarLabel {...props} i18nKey="screens:addSection.tabs.description" />
    ),
  },
});
