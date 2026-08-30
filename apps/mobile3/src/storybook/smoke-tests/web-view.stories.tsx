import type { Meta, StoryObj } from '@storybook/react-native';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

function WebViewDemo() {
  return (
    <View style={styles.container}>
      <ThemedText type="subtitle" style={styles.header}>
        WebView Smoke Test
      </ThemedText>
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
    padding: Spacing.three,
  },
  header: {
    marginBottom: 12,
  },
  webview: {
    flex: 1,
  },
});

const meta = {
  title: 'Dependencies Smoke Tests/WebView',
  component: WebViewDemo,
} satisfies Meta<typeof WebViewDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
