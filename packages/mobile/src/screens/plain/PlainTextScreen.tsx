import React, { useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import Markdown from '~/components/Markdown';
import { Screen } from '~/components/Screen';
import theme from '~/theme';

import type { PlainNavProps } from './types';

const styles = StyleSheet.create({
  content: {
    padding: theme.margin.single,
  },
});

const PlainTextScreen: React.FC<PlainNavProps> = ({ navigation, route }) => {
  const { text, title } = route.params;
  const { setOptions } = navigation;

  useEffect(() => {
    setOptions({ headerTitle: title });
  }, [setOptions, title]);

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
};
export default PlainTextScreen;
