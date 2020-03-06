import Icon from 'components/Icon';
import React from 'react';
import { I18nText } from '../../../i18n';
import theme from '../../../theme';
import registerScreen from '../../../utils/registerScreen';

export const LazySectionMapScreen = registerScreen({
  require: () => require('./SectionMapScreen'),
  navigationOptions: {
    tabBarLabel: <I18nText>section:map.title</I18nText>,
    tabBarIcon: () => (
      <Icon
        icon="map"
        color={theme.colors.textLight}
        testID="section-tab-map"
      />
    ),
  },
});
