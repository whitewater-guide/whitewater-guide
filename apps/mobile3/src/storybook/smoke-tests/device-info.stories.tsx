import type { Meta, StoryObj } from '@storybook/react-native';
import * as Application from 'expo-application';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { formatNullable, InfoRow } from './story-ui';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export interface DeviceInfoRow {
  label: string;
  value: string;
}

function deviceTypeLabel(deviceType: Device.DeviceType | null): string {
  if (deviceType == null) {
    return '—';
  }
  return Device.DeviceType[deviceType] ?? String(deviceType);
}

function DeviceInfoDemo() {
  const [rows, setRows] = useState<DeviceInfoRow[]>([]);

  useEffect(() => {
    async function load() {
      const vendorId =
        process.env.EXPO_OS === 'ios'
          ? await Application.getIosIdForVendorAsync()
          : process.env.EXPO_OS === 'android'
            ? Application.getAndroidId()
            : null;

      setRows([
        { label: 'Brand', value: formatNullable(Device.brand) },
        { label: 'Model', value: formatNullable(Device.modelName) },
        { label: 'Device Type', value: deviceTypeLabel(Device.deviceType) },
        { label: 'OS Name', value: formatNullable(Device.osName) },
        { label: 'OS Version', value: formatNullable(Device.osVersion) },
        { label: 'Device Name', value: formatNullable(Device.deviceName) },
        { label: 'App Name', value: formatNullable(Application.applicationName) },
        { label: 'App Version', value: formatNullable(Application.nativeApplicationVersion) },
        { label: 'Build Number', value: formatNullable(Application.nativeBuildVersion) },
        { label: 'Bundle ID', value: formatNullable(Application.applicationId) },
        { label: 'Vendor / Android ID', value: formatNullable(vendorId) },
        {
          label: 'Execution Env',
          value: formatNullable(Constants.executionEnvironment),
        },
        { label: 'Expo Version', value: formatNullable(Constants.expoVersion) },
        {
          label: 'Config Version',
          value: formatNullable(Constants.expoConfig?.version),
        },
      ]);
    }
    load();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText type="subtitle">Device Info</ThemedText>
      {rows.map((row) => (
        <InfoRow key={row.label} label={row.label} value={row.value} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
});

const meta = {
  title: 'Dependencies Smoke Tests/DeviceInfo',
  component: DeviceInfoDemo,
} satisfies Meta<typeof DeviceInfoDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
