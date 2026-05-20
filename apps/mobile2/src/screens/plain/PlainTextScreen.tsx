import { useLayoutEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import Markdown from '../../components/Markdown';
import Screen from '../../components/Screen';
import theme from '../../theme';
import type { PlainTextScreenProps } from './navigation-types';

const styles = StyleSheet.create({
  content: {
    padding: theme.margin.single,
  },
});

function PlainTextScreen({ navigation, route }: PlainTextScreenProps) {
  const { text, title } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: title });
  }, [navigation, title]);

  return (
    <Screen>
      <ScrollView
        style={StyleSheet.absoluteFill}
        contentContainerStyle={styles.content}
      >
        {!!text && <Markdown>{text}</Markdown>}
      </ScrollView>
    </Screen>
  );
}

export default PlainTextScreen;
