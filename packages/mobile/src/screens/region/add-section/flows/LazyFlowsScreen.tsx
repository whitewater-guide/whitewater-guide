import React from 'react';
import registerScreen from '../../../../utils/registerScreen';
import TabBarLabel from '../TabBarLabel';

export const LazyFlowsScreen = registerScreen({
  require: () => require('./FlowsScreen'),
  navigationOptions: {
    tabBarLabel: (props: any) => (
      <TabBarLabel {...props} i18nKey="screens:addSection.tabs.flows" />
    ),
  },
});
