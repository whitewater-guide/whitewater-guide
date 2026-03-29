import { FlashList } from '@shopify/flash-list';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

const DATA = Array.from({ length: 20 }, (_, i) => ({
  id: String(i),
  title: `Item ${i + 1}`,
}));

function FlashListDemo() {
  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.header}>
        FlashList Smoke Test
      </Text>
      <FlashList
        data={DATA}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text variant="bodyLarge">{item.title}</Text>
          </View>
        )}
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
  item: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
});

const meta: Meta<typeof FlashListDemo> = {
  title: 'Dependencies Smoke Tests/FlashList',
  component: FlashListDemo,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
