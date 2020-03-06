import Icon from 'components/Icon';
import React from 'react';
import { I18nText } from '../../../i18n';
import theme from '../../../theme';
import registerScreen from '../../../utils/registerScreen';

export const LazySectionInfoScreen = registerScreen({
  require: () => require('./SectionInfoScreen'),
  navigationOptions: {
    tabBarLabel: <I18nText>section:info.title</I18nText>,
    tabBarIcon: () => (
      <Icon
        icon="information"
        color={theme.colors.textLight}
        testID="section-tab-info"
      />
    ),
  },
});
