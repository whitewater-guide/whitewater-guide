import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import Markdown from '~/components/Markdown';
import { Screen } from '~/components/Screen';

import theme from '../../theme';
import { PlainNavProps } from './types';

const styles = StyleSheet.create({
  content: {
    padding: theme.margin.single,
  },
});

const PlainTextScreen: React.FC<PlainNavProps> = ({ navigation, route }) => {
  const { text, title } = route.params;
  React.useEffect(() => {
    navigation.setOptions({ headerTitle: title });
  }, [navigation.setOptions, title]);
  return (
    <Screen>
      <ScrollView
        style={StyleSheet.absoluteFill}
        contentContainerStyle={styles.content}
      >
        <Markdown>{text}</Markdown>
      </ScrollView>
    </Screen>
  );
};
export default PlainTextScreen;
