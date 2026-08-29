import type { Meta, StoryObj } from '@storybook/react-native';
import * as Clipboard from 'expo-clipboard';
import { useCallback, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { StoryButton } from './story-ui';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

function ClipboardDemo() {
  const theme = useTheme();
  const [input, setInput] = useState('');
  const [readValue, setReadValue] = useState<string | null>(null);

  const handleCopy = useCallback(async () => {
    await Clipboard.setStringAsync(input);
  }, [input]);

  const handlePaste = useCallback(async () => {
    const value = await Clipboard.getStringAsync();
    setReadValue(value);
  }, []);

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle">Clipboard</ThemedText>
      <TextInput
        placeholder="Text to copy"
        placeholderTextColor={theme.textSecondary}
        value={input}
        onChangeText={setInput}
        style={[
          styles.input,
          { color: theme.text, borderColor: theme.backgroundSelected },
        ]}
      />
      <StoryButton label="Copy to Clipboard" onPress={handleCopy} />
      <StoryButton
        label="Paste from Clipboard"
        variant="outlined"
        onPress={handlePaste}
      />
      <ThemedText>
        Pasted value: {readValue ?? '(not pasted yet)'}
      </ThemedText>
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
});

const meta = {
  title: 'Dependencies Smoke Tests/Clipboard',
  component: ClipboardDemo,
} satisfies Meta<typeof ClipboardDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
