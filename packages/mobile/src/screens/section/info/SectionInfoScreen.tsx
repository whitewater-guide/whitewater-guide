import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { Icon, Screen } from '../../../components';
import { RegionBanners } from '../../../features/banners';
import { I18nText } from '../../../i18n';
import theme from '../../../theme';
import { BannerPlacement } from '../../../ww-commons';
import { ScreenProps } from '../types';
import SectionInfoView from './SectionInfoView';

export const SectionInfoScreen: NavigationScreenComponent = (props) => {
  const screenProps: ScreenProps = props.screenProps as any;
  return (
    <Screen>
      <SectionInfoView section={screenProps.section} />
      <RegionBanners placement={BannerPlacement.MOBILE_SECTION_DESCRIPTION} count={10} />
    </Screen>
  );
};

SectionInfoScreen.navigationOptions = {
  tabBarLabel: <I18nText>section:info.title</I18nText>,
  tabBarIcon: () => (
    <Icon icon="information" color={theme.colors.textLight} />
  ),
};
