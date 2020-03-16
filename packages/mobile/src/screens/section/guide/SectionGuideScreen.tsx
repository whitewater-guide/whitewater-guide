import { useFocusEffect } from '@react-navigation/native';
import { useSection } from '@whitewater-guide/clients';
import { BannerPlacement } from '@whitewater-guide/commons';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Screen } from '~/components/Screen';
import { RegionBanners } from '../../../features/banners';
import theme from '../../../theme';
import SuggestionFAB from '../SuggestionFAB';
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
      navigation.dangerouslyGetParent()?.setOptions({
        headerRight: () => <SectionGuideMenu section={section.node} />,
      });

      return () => {
        navigation.dangerouslyGetParent()?.setOptions({
          headerRight: () => null,
        });
      };
    }, [navigation, section.node]),
  );

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
