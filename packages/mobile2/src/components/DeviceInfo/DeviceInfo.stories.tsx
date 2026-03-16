import type { Meta, StoryObj } from '@storybook/react';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { DataTable, Text } from 'react-native-paper';

function DeviceInfoDemo() {
  const [info, setInfo] = useState<Array<{ label: string; value: string }>>([]);

  useEffect(() => {
    async function load() {
      const rows = [
        { label: 'Brand', value: DeviceInfo.getBrand() },
        { label: 'Model', value: DeviceInfo.getModel() },
        { label: 'Device ID', value: DeviceInfo.getDeviceId() },
        { label: 'System Name', value: DeviceInfo.getSystemName() },
        { label: 'System Version', value: DeviceInfo.getSystemVersion() },
        { label: 'App Version', value: DeviceInfo.getVersion() },
        { label: 'Build Number', value: DeviceInfo.getBuildNumber() },
        { label: 'Bundle ID', value: DeviceInfo.getBundleId() },
        { label: 'Unique ID', value: await DeviceInfo.getUniqueId() },
        { label: 'Device Name', value: await DeviceInfo.getDeviceName() },
      ];
      setInfo(rows);
    }
    load();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text variant="titleMedium" style={styles.header}>
        Device Info
      </Text>
      <DataTable>
        {info.map((row) => (
          <DataTable.Row key={row.label}>
            <DataTable.Cell>{row.label}</DataTable.Cell>
            <DataTable.Cell>{row.value}</DataTable.Cell>
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
});

const meta: Meta<typeof DeviceInfoDemo> = {
  title: 'DeviceInfo',
  component: DeviceInfoDemo,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
