import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { WebView } from 'react-native-webview';

function WebViewDemo() {
  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.header}>
        WebView Smoke Test
      </Text>
      <WebView
        source={{ uri: 'https://reactnative.dev' }}
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  webview: {
    flex: 1,
  },
});

const meta: Meta<typeof WebViewDemo> = {
  title: 'WebView',
  component: WebViewDemo,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
