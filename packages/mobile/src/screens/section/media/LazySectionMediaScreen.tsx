import Icon from 'components/Icon';
import React from 'react';
import { I18nText } from '../../../i18n';
import theme from '../../../theme';
import registerScreen from '../../../utils/registerScreen';

export const LazySectionMediaScreen = registerScreen({
  require: () => require('./SectionMediaScreen'),
  navigationOptions: {
    tabBarLabel: <I18nText>section:media.title</I18nText>,
    tabBarIcon: () => (
      <Icon icon="image-multiple" color={theme.colors.textLight} />
    ),
  },
});
