import React from 'react';
import registerScreen from '../../../../utils/registerScreen';

export const LazyGaugeScreen = registerScreen({
  require: () => require('./GaugeScreen'),
  navigationOptions: {
    headerTitle: 'screens:addSection.gauge.title',
  },
});
