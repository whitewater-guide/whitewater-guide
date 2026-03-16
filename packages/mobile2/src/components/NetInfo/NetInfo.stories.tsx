import NetInfo, { useNetInfo } from '@react-native-community/netinfo';
import type { Meta, StoryObj } from '@storybook/react';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, DataTable, Text } from 'react-native-paper';

function NetInfoDemo() {
  const netInfo = useNetInfo();
  const [fetchResult, setFetchResult] = useState<string | null>(null);

  const handleFetch = useCallback(async () => {
    const state = await NetInfo.fetch();
    setFetchResult(JSON.stringify(state, null, 2));
  }, []);

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.header}>
        NetInfo (live)
      </Text>
      <DataTable>
        <DataTable.Row>
          <DataTable.Cell>Type</DataTable.Cell>
          <DataTable.Cell>{netInfo.type}</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>Connected</DataTable.Cell>
          <DataTable.Cell>
            {!netInfo.isConnected
              ? 'unknown'
              : netInfo.isConnected
                ? 'Yes'
                : 'No'}
          </DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>Internet Reachable</DataTable.Cell>
          <DataTable.Cell>
            {!netInfo.isInternetReachable
              ? 'unknown'
              : netInfo.isInternetReachable
                ? 'Yes'
                : 'No'}
          </DataTable.Cell>
        </DataTable.Row>
      </DataTable>
      <Button mode="outlined" onPress={handleFetch} style={styles.button}>
        Fetch State
      </Button>
      {fetchResult && (
        <Text variant="bodySmall" style={styles.json}>
          {fetchResult}
        </Text>
      )}
    </View>
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
  button: {
    marginTop: 12,
  },
  json: {
    marginTop: 12,
    fontFamily: 'monospace',
  },
});

const meta: Meta<typeof NetInfoDemo> = {
  title: 'NetInfo',
  component: NetInfoDemo,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
