import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import theme from '../../../theme';
import SectionFAB from '../SectionFAB';
import SectionTabsScreen from '../SectionTabsScreen';
import type { SectionMediaScreenProps } from './navigation-types';
import SectionMediaScreenContent from './SectionMediaScreenContent';

function SectionMediaScreen({ navigation }: SectionMediaScreenProps) {
  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({ headerRight: () => null });
    }, [navigation]),
  );

  return (
    <SectionTabsScreen>
      <ScrollView contentContainerStyle={styles.content}>
        <SectionMediaScreenContent />
        <View style={styles.fabSpacer} />
      </ScrollView>
      <SectionFAB />
    </SectionTabsScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: theme.margin.single,
  },
  fabSpacer: {
    height: 64,
  },
});

export default SectionMediaScreen;
