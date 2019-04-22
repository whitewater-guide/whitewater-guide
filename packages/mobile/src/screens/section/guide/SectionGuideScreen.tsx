import { BannerPlacement } from '@whitewater-guide/commons';
import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { Icon, Screen } from '../../../components';
import { RegionBanners } from '../../../features/banners';
import { I18nText } from '../../../i18n';
import theme from '../../../theme';
import { ScreenProps } from '../types';
import SectionGuideView from './SectionGuideView';

export const SectionGuideScreen: NavigationScreenComponent = ({
  screenProps,
}) => {
  const { section }: ScreenProps = screenProps as any;
  return (
    <Screen>
      <SectionGuideView section={section} />
      <RegionBanners
        placement={BannerPlacement.MOBILE_SECTION_DESCRIPTION}
        count={10}
      />
    </Screen>
  );
};

SectionGuideScreen.navigationOptions = {
  tabBarLabel: <I18nText>section:guide.title</I18nText>,
  tabBarIcon: () => (
    <Icon icon="book-open-variant" color={theme.colors.textLight} />
  ),
};
