import { useFocusEffect } from '@react-navigation/native';
import { useSectionQuery } from '@whitewater-guide/clients';
import { BannerPlacement } from '@whitewater-guide/schema';
import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { RegionBanners } from '~/features/banners';
import theme from '~/theme';

import SectionFAB from '../SectionFAB';
import SectionTabsScreen from '../SectionTabsScreen';
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
  const { data, loading, refetch } = useSectionQuery();
  const section = data?.section;

  useFocusEffect(
    React.useCallback(() => {
      navigation.getParent()?.setOptions({
        // eslint-disable-next-line react/no-unstable-nested-components
        headerRight: () => <SectionGuideMenu section={section} />,
      });
    }, [navigation, section]),
  );

  return (
    <SectionTabsScreen>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
      >
        <SectionGuideView section={section} />
        <RegionBanners
          placement={BannerPlacement.MobileRegionDescription}
          count={10}
        />
        <View style={styles.fabHelper} />
      </ScrollView>

      <SectionFAB testID="section-guide-fab" />
    </SectionTabsScreen>
  );
};

export default SectionGuideScreen;
