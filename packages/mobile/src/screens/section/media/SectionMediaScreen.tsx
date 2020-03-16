import { useSection } from '@whitewater-guide/clients';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Screen } from '~/components/Screen';
import theme from '../../../theme';
import SectionMediaScreenContent from './SectionMediaScreenContent';
import SuggestMediaFAB from './SuggestMediaFAB';
import { SectionMediaNavProps } from './types';

const styles = StyleSheet.create({
  content: {
    padding: theme.margin.single,
  },
  fabHelper: {
    height: 64,
  },
});

const SectionMediaScreen: React.FC<SectionMediaNavProps> = () => {
  const { node } = useSection();
  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <SectionMediaScreenContent section={node} />
        <View style={styles.fabHelper} />
      </ScrollView>
      <SuggestMediaFAB />
    </Screen>
  );
};

export default SectionMediaScreen;
