import type { Meta, StoryObj } from '@storybook/react-native';
import { useCalendars, useLocales } from 'expo-localization';
import { ScrollView, StyleSheet } from 'react-native';

import { formatNullable, InfoRow } from './story-ui';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

function LocalizationDemo() {
  const locales = useLocales();
  const [calendar] = useCalendars();
  const primary = locales[0];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText type="subtitle">Localization</ThemedText>
      <InfoRow label="Region" value={formatNullable(primary.regionCode)} />
      <InfoRow label="Calendar" value={formatNullable(calendar.calendar)} />
      <InfoRow
        label="Temperature"
        value={formatNullable(primary.temperatureUnit)}
      />
      <InfoRow label="Time Zone" value={formatNullable(calendar.timeZone)} />
      <InfoRow
        label="24h Clock"
        value={formatNullable(calendar.uses24hourClock)}
      />
      <InfoRow
        label="Measurement"
        value={formatNullable(primary.measurementSystem)}
      />
      <InfoRow
        label="Currency"
        value={formatNullable(primary.currencyCode)}
      />

      <ThemedText type="smallBold" style={styles.subheader}>
        Detected Locales
      </ThemedText>
      {locales.map((locale) => (
        <InfoRow
          key={locale.languageTag}
          label={locale.languageTag}
          value={`${formatNullable(locale.languageScriptCode)} · ${locale.textDirection}`}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  subheader: {
    marginTop: Spacing.three,
  },
});

const meta = {
  title: 'Dependencies Smoke Tests/Localization',
  component: LocalizationDemo,
} satisfies Meta<typeof LocalizationDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
