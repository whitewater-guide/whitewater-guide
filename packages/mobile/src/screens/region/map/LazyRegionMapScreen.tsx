import Icon from 'components/Icon';
import React from 'react';
import { I18nText } from '../../../i18n';
import theme from '../../../theme';
import registerScreen from '../../../utils/registerScreen';

export const LazyRegionMapScreen = registerScreen({
  require: () => require('./RegionMapScreen'),
  navigationOptions: {
    tabBarLabel: <I18nText>region:map.title</I18nText>,
    tabBarIcon: () => (
      <Icon icon="map" color={theme.colors.textLight} testID="region-tab-map" />
    ),
  },
});
