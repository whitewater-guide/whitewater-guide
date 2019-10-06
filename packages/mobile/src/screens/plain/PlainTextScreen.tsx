import Markdown from 'components/Markdown';
import { Screen } from 'components/Screen';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { NavigationScreenComponent } from 'react-navigation';
import theme from '../../theme';

const styles = StyleSheet.create({
  content: {
    padding: theme.margin.single,
  },
});

interface NavParams {
  title?: string;
  text?: string;
}

const PlainTextScreen: NavigationScreenComponent<NavParams> = ({
  navigation,
}) => (
  <Screen>
    <ScrollView
      style={StyleSheet.absoluteFill}
      contentContainerStyle={styles.content}
    >
      <Markdown>{navigation.getParam('text')}</Markdown>
    </ScrollView>
  </Screen>
);

export default PlainTextScreen;
