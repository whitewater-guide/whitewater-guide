import { useFocusEffect } from '@react-navigation/native';
import { useSection } from '@whitewater-guide/clients';
import { BannerPlacement } from '@whitewater-guide/schema';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Screen } from '~/components/Screen';
import { RegionBanners } from '~/features/banners';
import theme from '~/theme';

import SectionFAB from '../SectionFAB';
import SectionGuideMenu from './SectionGuideMenu';
import SectionGuideView from './SectionGuideView';
import { SectionGuideNavProps } from './types';

const styles = StyleSheet.create({
  content: {
    padding: theme.margin.single,
  },
  fabHelper: {
    height: 64,
  },
});

const SectionGuideScreen: React.FC<SectionGuideNavProps> = ({ navigation }) => {
  const section = useSection();

  useFocusEffect(
    React.useCallback(() => {
      navigation.getParent()?.setOptions({
        // eslint-disable-next-line react/no-unstable-nested-components
        headerRight: () => <SectionGuideMenu section={section} />,
      });
    }, [navigation, section]),
  );

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <SectionGuideView section={section} />
        <RegionBanners
          placement={BannerPlacement.MobileRegionDescription}
          count={10}
        />
        <View style={styles.fabHelper} />
      </ScrollView>
      <SectionFAB testID="section-guide-fab" />
    </Screen>
  );
};

export default SectionGuideScreen;
