import Icon from 'components/Icon';
import React from 'react';
import { I18nText } from '../../../i18n';
import theme from '../../../theme';
import registerScreen from '../../../utils/registerScreen';

export const LazyRegionSectionsListScreen = registerScreen({
  require: () => require('./RegionSectionsListScreen'),
  navigationOptions: {
    tabBarLabel: <I18nText>{'region:sections.title'}</I18nText>,
    tabBarIcon: () => <Icon icon="view-list" color={theme.colors.textLight} />,
  },
});
