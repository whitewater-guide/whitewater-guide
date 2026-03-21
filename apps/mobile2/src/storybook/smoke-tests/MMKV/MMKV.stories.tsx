import type { Meta, StoryObj } from '@storybook/react';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { createMMKV } from 'react-native-mmkv';
import { Button, Text, TextInput } from 'react-native-paper';

const storage = createMMKV();
const STORAGE_KEY = 'storybook.mmkv.test';

function MMKVDemo() {
  const [input, setInput] = useState('');
  const [readValue, setReadValue] = useState<string | undefined>();

  const handleWrite = useCallback(() => {
    storage.set(STORAGE_KEY, input);
  }, [input]);

  const handleRead = useCallback(() => {
    setReadValue(storage.getString(STORAGE_KEY));
  }, []);

  return (
    <View style={styles.container}>
      <Text variant="titleMedium">MMKV Storage</Text>
      <TextInput
        label="Value to store"
        value={input}
        onChangeText={setInput}
        mode="outlined"
      />
      <Button mode="contained" onPress={handleWrite}>
        Write
      </Button>
      <Button mode="outlined" onPress={handleRead}>
        Read
      </Button>
      <Text variant="bodyLarge">
        Read value: {readValue ?? '(not read yet)'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
});

const meta: Meta<typeof MMKVDemo> = {
  title: 'Dependencies Smoke Tests/MMKV',
  component: MMKVDemo,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
