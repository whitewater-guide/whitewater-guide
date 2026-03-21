import Clipboard from '@react-native-clipboard/clipboard';
import type { Meta, StoryObj } from '@storybook/react';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

function ClipboardDemo() {
  const [input, setInput] = useState('');
  const [readValue, setReadValue] = useState<string | null>(null);

  const handleCopy = useCallback(() => {
    Clipboard.setString(input);
  }, [input]);

  const handlePaste = useCallback(async () => {
    const value = await Clipboard.getString();
    setReadValue(value);
  }, []);

  return (
    <View style={styles.container}>
      <Text variant="titleMedium">Clipboard</Text>
      <TextInput
        label="Text to copy"
        value={input}
        onChangeText={setInput}
        mode="outlined"
      />
      <Button mode="contained" onPress={handleCopy}>
        Copy to Clipboard
      </Button>
      <Button mode="outlined" onPress={handlePaste}>
        Paste from Clipboard
      </Button>
      <Text variant="bodyLarge">
        Pasted value: {readValue ?? '(not pasted yet)'}
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

const meta: Meta<typeof ClipboardDemo> = {
  title: 'Dependencies Smoke Tests/Clipboard',
  component: ClipboardDemo,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
