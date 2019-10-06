import React from 'react';
import registerScreen from '../../../../utils/registerScreen';
import TabBarLabel from '../TabBarLabel';

export const LazyAttributesScreen = registerScreen({
  require: () => require('./AttributesScreen'),
  navigationOptions: {
    tabBarLabel: (props: any) => (
      <TabBarLabel {...props} i18nKey="screens:addSection.tabs.attributes" />
    ),
  },
});
