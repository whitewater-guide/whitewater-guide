import type { Meta, StoryObj } from '@storybook/react-native';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { StoryButton } from './story-ui';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const STORAGE_KEY = 'storybook.securestore.test';

function SecureStoreDemo() {
  const theme = useTheme();
  const [input, setInput] = useState('');
  const [readValue, setReadValue] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleWrite = useCallback(async () => {
    try {
      await SecureStore.setItemAsync(STORAGE_KEY, input);
      setError(null);
    } catch (e) {
      setError(String(e));
    }
  }, [input]);

  const handleRead = useCallback(async () => {
    try {
      const value = await SecureStore.getItemAsync(STORAGE_KEY);
      setReadValue(value);
      setError(null);
    } catch (e) {
      setError(String(e));
    }
  }, []);

  const backend =
    process.env.EXPO_OS === 'ios' ? 'Keychain' : 'Encrypted SharedPreferences';

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle">Secure Store</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        Backend: {backend}
      </ThemedText>
      <TextInput
        placeholder="Value to store securely"
        placeholderTextColor={theme.textSecondary}
        value={input}
        onChangeText={setInput}
        style={[
          styles.input,
          { color: theme.text, borderColor: theme.backgroundSelected },
        ]}
      />
      <StoryButton label="Write" onPress={handleWrite} />
      <StoryButton label="Read" variant="outlined" onPress={handleRead} />
      <ThemedText>Read value: {readValue ?? '(not read yet)'}</ThemedText>
      {error ? (
        <ThemedText type="small" style={styles.error}>
          Error: {error}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  error: {
    color: '#c62828',
  },
});

const meta = {
  title: 'Dependencies Smoke Tests/SecureStore',
  component: SecureStoreDemo,
} satisfies Meta<typeof SecureStoreDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
