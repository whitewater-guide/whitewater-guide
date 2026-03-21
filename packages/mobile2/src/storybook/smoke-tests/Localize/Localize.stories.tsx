import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import * as RNLocalize from 'react-native-localize';
import { DataTable, Text } from 'react-native-paper';

function LocalizeDemo() {
  const locales = RNLocalize.getLocales();
  const currencies = RNLocalize.getCurrencies();
  const country = RNLocalize.getCountry();
  const calendar = RNLocalize.getCalendar();
  const tempUnit = RNLocalize.getTemperatureUnit();
  const timeZone = RNLocalize.getTimeZone();
  const uses24h = RNLocalize.uses24HourClock();

  return (
    <ScrollView style={styles.container}>
      <Text variant="titleMedium" style={styles.header}>
        Localize
      </Text>
      <DataTable>
        <DataTable.Row>
          <DataTable.Cell>Country</DataTable.Cell>
          <DataTable.Cell>{country}</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>Calendar</DataTable.Cell>
          <DataTable.Cell>{calendar}</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>Temperature</DataTable.Cell>
          <DataTable.Cell>{tempUnit}</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>Time Zone</DataTable.Cell>
          <DataTable.Cell>{timeZone}</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>24h Clock</DataTable.Cell>
          <DataTable.Cell>{uses24h ? 'Yes' : 'No'}</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>Currencies</DataTable.Cell>
          <DataTable.Cell>{currencies.join(', ')}</DataTable.Cell>
        </DataTable.Row>
      </DataTable>

      <Text variant="titleSmall" style={styles.subheader}>
        Detected Locales
      </Text>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Code</DataTable.Title>
          <DataTable.Title>Script</DataTable.Title>
          <DataTable.Title>RTL</DataTable.Title>
        </DataTable.Header>
        {locales.map((locale) => (
          <DataTable.Row key={locale.languageTag}>
            <DataTable.Cell>{locale.languageTag}</DataTable.Cell>
            <DataTable.Cell>{locale.scriptCode ?? '-'}</DataTable.Cell>
            <DataTable.Cell>{locale.isRTL ? 'Yes' : 'No'}</DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  subheader: {
    marginTop: 16,
    marginBottom: 8,
  },
});

const meta: Meta<typeof LocalizeDemo> = {
  title: 'Dependencies Smoke Tests/Localize',
  component: LocalizeDemo,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
