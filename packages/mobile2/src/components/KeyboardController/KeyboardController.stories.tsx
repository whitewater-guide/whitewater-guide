import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  KeyboardAvoidingView,
  KeyboardProvider,
} from 'react-native-keyboard-controller';
import { Text, TextInput } from 'react-native-paper';

function KeyboardControllerDemo() {
  return (
    <KeyboardProvider>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.spacer} />
        <Text variant="titleMedium">Keyboard Controller</Text>
        <Text variant="bodyMedium">
          Tap the input below — the view should avoid the keyboard.
        </Text>
        <TextInput label="First name" mode="outlined" />
        <TextInput label="Last name" mode="outlined" />
        <TextInput label="Email" mode="outlined" keyboardType="email-address" />
        <TextInput label="Notes" mode="outlined" multiline numberOfLines={4} />
      </KeyboardAvoidingView>
    </KeyboardProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  spacer: {
    flex: 1,
  },
});

const meta: Meta<typeof KeyboardControllerDemo> = {
  title: 'KeyboardController',
  component: KeyboardControllerDemo,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
