import DateTimePicker, {
  type DateTimePickerChangeEvent,
} from '@expo/ui/community/datetime-picker';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { StoryButton } from './story-ui';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

function DateTimePickerDemo() {
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const onDateChange = useCallback(
    (_event: DateTimePickerChangeEvent, selectedDate: Date) => {
      if (process.env.EXPO_OS === 'android') {
        setShowDate(false);
      }
      setDate(selectedDate);
    },
    [],
  );

  const onTimeChange = useCallback(
    (_event: DateTimePickerChangeEvent, selectedDate: Date) => {
      if (process.env.EXPO_OS === 'android') {
        setShowTime(false);
      }
      setDate(selectedDate);
    },
    [],
  );

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle">DateTimePicker</ThemedText>
      <ThemedText>
        Selected: {date.toLocaleDateString()} {date.toLocaleTimeString()}
      </ThemedText>
      <View style={styles.buttons}>
        <StoryButton label="Pick Date" onPress={() => setShowDate(true)} />
        <StoryButton label="Pick Time" onPress={() => setShowTime(true)} />
      </View>
      {showDate ? (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onValueChange={onDateChange}
          onDismiss={() => setShowDate(false)}
        />
      ) : null}
      {showTime ? (
        <DateTimePicker
          value={date}
          mode="time"
          display="default"
          onValueChange={onTimeChange}
          onDismiss={() => setShowTime(false)}
        />
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
  buttons: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
});

const meta = {
  title: 'Dependencies Smoke Tests/DateTimePicker',
  component: DateTimePickerDemo,
} satisfies Meta<typeof DateTimePickerDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
