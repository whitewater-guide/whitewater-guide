import Icon from 'components/Icon';
import React from 'react';
import { I18nText } from '../../../i18n';
import theme from '../../../theme';
import registerScreen from '../../../utils/registerScreen';

export const LazySectionChartScreen = registerScreen({
  require: () => require('./SectionChartScreen'),
  navigationOptions: {
    tabBarLabel: <I18nText>section:chart.title</I18nText>,
    tabBarIcon: () => <Icon icon="chart-line" color={theme.colors.textLight} />,
  },
});
