import { FlashList } from '@shopify/flash-list';
import type { Meta, StoryObj } from '@storybook/react-native';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

interface FlashListItem {
  id: string;
  title: string;
}

const DATA: FlashListItem[] = Array.from({ length: 20 }, (_, i) => ({
  id: String(i),
  title: `Item ${i + 1}`,
}));

function FlashListDemo() {
  return (
    <View style={styles.container}>
      <ThemedText type="subtitle" style={styles.header}>
        FlashList Smoke Test
      </ThemedText>
      <FlashList
        data={DATA}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <ThemedText>{item.title}</ThemedText>
          </View>
        )}
        style={styles.list}
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
  list: {
    flex: 1,
  },
  item: {
    padding: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
});

const meta = {
  title: 'Dependencies Smoke Tests/FlashList',
  component: FlashListDemo,
} satisfies Meta<typeof FlashListDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
