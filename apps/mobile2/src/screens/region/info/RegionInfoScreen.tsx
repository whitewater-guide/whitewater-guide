import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import theme from '../../../theme';
import type { RegionInfoScreenProps } from './navigation-types';
import RegionInfoView from './RegionInfoView';
import RegionLicense from './RegionLicense';

const styles = StyleSheet.create({
  content: {
    padding: theme.margin.single,
  },
});

function RegionInfoScreen(_: RegionInfoScreenProps) {
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <ScrollView
      contentContainerStyle={[styles.content, { paddingBottom: tabBarHeight }]}
    >
      <RegionInfoView />
      <RegionLicense />
    </ScrollView>
  );
}

export default RegionInfoScreen;
