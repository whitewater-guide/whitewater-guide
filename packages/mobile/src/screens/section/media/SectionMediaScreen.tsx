import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import theme from '~/theme';

import SectionFAB from '../SectionFAB';
import SectionTabsScreen from '../SectionTabsScreen';
import SectionMediaScreenContent from './SectionMediaScreenContent';
import { SectionMediaNavProps } from './types';

const styles = StyleSheet.create({
  content: {
    padding: theme.margin.single,
  },
  fabHelper: {
    height: 64,
  },
});

const SectionMediaScreen: React.FC<SectionMediaNavProps> = ({ navigation }) => {
  useFocusEffect(
    React.useCallback(() => {
      navigation.getParent()?.setOptions({
        // eslint-disable-next-line react/no-unstable-nested-components
        headerRight: () => null,
      });
    }, [navigation]),
  );

  return (
    <SectionTabsScreen>
      <ScrollView contentContainerStyle={styles.content}>
        <SectionMediaScreenContent />
        <View style={styles.fabHelper} />
      </ScrollView>
      <SectionFAB />
    </SectionTabsScreen>
  );
};

export default SectionMediaScreen;
