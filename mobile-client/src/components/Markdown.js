import React from 'react';
import { StyleSheet } from 'react-native';
import SimpleMarkdown from 'react-native-simple-markdown';
import theme from '../theme';

const styles = StyleSheet.create({
  view: {
    padding: 8,
  },
  link: {
    color: theme.colors.primary,
  }
});

export const Markdown = ({ children }) => (
  <SimpleMarkdown styles={styles}>
    {children}
  </SimpleMarkdown>
);
