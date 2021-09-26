import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Screen } from '~/components/Screen';
import theme from '~/theme';

import SectionFAB from '../SectionFAB';
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
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <SectionMediaScreenContent />
        <View style={styles.fabHelper} />
      </ScrollView>
      <SectionFAB />
    </Screen>
  );
};

export default SectionMediaScreen;
