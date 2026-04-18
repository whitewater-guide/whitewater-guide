import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import theme from '../../../theme';
import SectionTabsScreen from '../SectionTabsScreen';
import SectionMediaScreenContent from './SectionMediaScreenContent';

function SectionMediaScreen() {
  const navigation = useNavigation();

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
