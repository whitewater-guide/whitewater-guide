import type { Meta, StoryObj } from '@storybook/react';
import React, { useCallback, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import SInfo from 'react-native-sensitive-info';

const STORAGE_KEY = 'storybook.sensitiveinfo.test';
const OPTIONS = {
  sharedPreferencesName: 'storybookPrefs',
  keychainService: 'storybookKeychain',
};

function SensitiveInfoDemo() {
  const [input, setInput] = useState('');
  const [readValue, setReadValue] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleWrite = useCallback(async () => {
    try {
      await SInfo.setItem(STORAGE_KEY, input, OPTIONS);
      setError(null);
    } catch (e) {
      setError(String(e));
    }
  }, [input]);

  const handleRead = useCallback(async () => {
    try {
      const value = await SInfo.getItem(STORAGE_KEY, OPTIONS);
      setReadValue(value);
      setError(null);
    } catch (e) {
      setError(String(e));
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text variant="titleMedium">Sensitive Info (Secure Storage)</Text>
      <Text variant="bodySmall">
        Backend: {Platform.OS === 'ios' ? 'Keychain' : 'SharedPreferences'}
      </Text>
      <TextInput
        label="Value to store securely"
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

const meta: Meta<typeof SensitiveInfoDemo> = {
  title: 'SensitiveInfo',
  component: SensitiveInfoDemo,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
