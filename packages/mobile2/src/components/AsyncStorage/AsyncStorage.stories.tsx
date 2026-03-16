import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Meta, StoryObj } from '@storybook/react';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

const STORAGE_KEY = 'storybook.asyncstorage.test';

function AsyncStorageDemo() {
  const [input, setInput] = useState('');
  const [readValue, setReadValue] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleWrite = useCallback(async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, input);
      setError(null);
    } catch (e) {
      setError(String(e));
    }
  }, [input]);

  const handleRead = useCallback(async () => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEY);
      setReadValue(value);
      setError(null);
    } catch (e) {
      setError(String(e));
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text variant="titleMedium">AsyncStorage</Text>
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
      {error && (
        <Text variant="bodySmall" style={styles.error}>
          Error: {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  error: {
    color: 'red',
  },
});

const meta: Meta<typeof AsyncStorageDemo> = {
  title: 'AsyncStorage',
  component: AsyncStorageDemo,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
