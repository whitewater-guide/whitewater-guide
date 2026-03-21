import MaterialIcons from '@react-native-vector-icons/material-design-icons';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';

function PaperUIShowcase() {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title
          title="Paper UI Smoke Test"
          subtitle="react-native-paper v5"
        />
        <Card.Content>
          <Text variant="bodyMedium">
            This card verifies that react-native-paper renders correctly.
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="outlined" onPress={() => {}}>
            Outlined
          </Button>
          <Button mode="contained" onPress={() => {}}>
            Contained
          </Button>
        </Card.Actions>
      </Card>

      <View style={styles.iconRow}>
        <MaterialIcons name="map" size={32} color="#6200ee" />
        <MaterialIcons name="water" size={32} color="#03dac6" />
        <MaterialIcons name="kayaking" size={32} color="#ff5722" />
      </View>

      <Button icon="check" mode="contained-tonal" onPress={() => {}}>
        Paper Button with Icon
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  card: {
    marginBottom: 8,
  },
  iconRow: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const meta: Meta<typeof PaperUIShowcase> = {
  title: 'Dependencies Smoke Tests/PaperUI',
  component: PaperUIShowcase,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
