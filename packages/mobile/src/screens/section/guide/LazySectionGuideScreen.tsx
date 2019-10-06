import Icon from 'components/Icon';
import React from 'react';
import { I18nText } from '../../../i18n';
import theme from '../../../theme';
import registerScreen from '../../../utils/registerScreen';

export const LazySectionGuideScreen = registerScreen({
  require: () => require('./SectionGuideScreen'),
  navigationOptions: {
    tabBarLabel: <I18nText>section:guide.title</I18nText>,
    tabBarIcon: () => (
      <Icon icon="book-open-variant" color={theme.colors.textLight} />
    ),
  },
});
