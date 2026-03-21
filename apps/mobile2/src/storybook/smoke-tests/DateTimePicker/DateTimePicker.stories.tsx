import DateTimePicker from '@react-native-community/datetimepicker';
import type { Meta, StoryObj } from '@storybook/react';
import React, { useCallback, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

function DateTimePickerDemo() {
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const onDateChange = useCallback((_event: unknown, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDate(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
    }
  }, []);

  const onTimeChange = useCallback((_event: unknown, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowTime(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text variant="titleMedium">DateTimePicker</Text>
      <Text variant="bodyLarge">
        Selected: {date.toLocaleDateString()} {date.toLocaleTimeString()}
      </Text>
      <View style={styles.buttons}>
        <Button mode="contained" onPress={() => setShowDate(true)}>
          Pick Date
        </Button>
        <Button mode="contained" onPress={() => setShowTime(true)}>
          Pick Time
        </Button>
      </View>
      {showDate && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
      {showTime && (
        <DateTimePicker
          value={date}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
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
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
});

const meta: Meta<typeof DateTimePickerDemo> = {
  title: 'Dependencies Smoke Tests/DateTimePicker',
  component: DateTimePickerDemo,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
