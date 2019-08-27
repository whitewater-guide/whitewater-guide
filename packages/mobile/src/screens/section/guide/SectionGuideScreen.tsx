import { useSection } from '@whitewater-guide/clients';
import { BannerPlacement } from '@whitewater-guide/commons';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { NavigationScreenComponent } from 'react-navigation';
import { Icon, Screen } from '../../../components';
import { RegionBanners } from '../../../features/banners';
import { I18nText } from '../../../i18n';
import theme from '../../../theme';
import SectionGuideView from './SectionGuideView';

const styles = StyleSheet.create({
  content: {
    padding: theme.margin.single,
  },
  fabHelper: {
    height: 64,
  },
});

export const SectionGuideScreen: NavigationScreenComponent = () => {
  const section = useSection();
  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <SectionGuideView section={section} />
        <RegionBanners
          placement={BannerPlacement.MOBILE_SECTION_DESCRIPTION}
          count={10}
        />
        <View style={styles.fabHelper} />
      </ScrollView>
    </Screen>
  );
};

SectionGuideScreen.navigationOptions = {
  tabBarLabel: <I18nText>section:guide.title</I18nText>,
  tabBarIcon: () => (
    <Icon icon="book-open-variant" color={theme.colors.textLight} />
  ),
};
