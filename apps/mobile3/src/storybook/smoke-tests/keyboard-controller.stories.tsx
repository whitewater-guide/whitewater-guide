import type { Meta, StoryObj } from '@storybook/react-native';
import { StyleSheet, TextInput, View } from 'react-native';
import {
  KeyboardAvoidingView,
  KeyboardProvider,
} from 'react-native-keyboard-controller';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

function KeyboardControllerDemo() {
  const theme = useTheme();
  const inputStyle = [
    styles.input,
    { color: theme.text, borderColor: theme.backgroundSelected },
  ];

  return (
    <KeyboardProvider>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.spacer} />
        <ThemedText type="subtitle">Keyboard Controller</ThemedText>
        <ThemedText>
          Tap the input below — the view should avoid the keyboard.
        </ThemedText>
        <TextInput
          placeholder="First name"
          placeholderTextColor={theme.textSecondary}
          style={inputStyle}
        />
        <TextInput
          placeholder="Last name"
          placeholderTextColor={theme.textSecondary}
          style={inputStyle}
        />
        <TextInput
          placeholder="Email"
          placeholderTextColor={theme.textSecondary}
          keyboardType="email-address"
          style={inputStyle}
        />
        <TextInput
          placeholder="Notes"
          placeholderTextColor={theme.textSecondary}
          multiline
          numberOfLines={4}
          style={[inputStyle, styles.multiline]}
        />
      </KeyboardAvoidingView>
    </KeyboardProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.three,
    gap: 12,
  },
  spacer: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  multiline: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
});

const meta = {
  title: 'Dependencies Smoke Tests/KeyboardController',
  component: KeyboardControllerDemo,
} satisfies Meta<typeof KeyboardControllerDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
