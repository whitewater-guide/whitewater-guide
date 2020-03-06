import { useSection } from '@whitewater-guide/clients';
import { BannerPlacement } from '@whitewater-guide/commons';
import { Screen } from 'components/Screen';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { NavigationScreenComponent } from 'react-navigation';
import { RegionBanners } from '../../../features/banners';
import theme from '../../../theme';
import SuggestionFAB from '../SuggestionFAB';
import SectionGuideView from './SectionGuideView';

const styles = StyleSheet.create({
  content: {
    padding: theme.margin.single,
  },
  fabHelper: {
    height: 64,
  },
});

const SectionGuideScreen: NavigationScreenComponent = () => {
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
      <SuggestionFAB testID="section-guide-fab" />
    </Screen>
  );
};

export default SectionGuideScreen;
