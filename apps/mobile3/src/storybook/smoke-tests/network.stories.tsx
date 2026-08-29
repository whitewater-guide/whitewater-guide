import type { Meta, StoryObj } from '@storybook/react-native';
import { getNetworkStateAsync, useNetworkState } from 'expo-network';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { formatNullable, InfoRow, StoryButton } from './story-ui';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

function NetworkDemo() {
  const networkState = useNetworkState();
  const [fetchResult, setFetchResult] = useState<string | null>(null);

  const handleFetch = useCallback(async () => {
    const state = await getNetworkStateAsync();
    setFetchResult(JSON.stringify(state, null, 2));
  }, []);

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle">Network (live)</ThemedText>
      <InfoRow label="Type" value={formatNullable(networkState.type)} />
      <InfoRow
        label="Connected"
        value={formatNullable(networkState.isConnected)}
      />
      <InfoRow
        label="Internet Reachable"
        value={formatNullable(networkState.isInternetReachable)}
      />
      <StoryButton
        label="Fetch State"
        variant="outlined"
        onPress={handleFetch}
      />
      {fetchResult ? (
        <ThemedText type="code">{fetchResult}</ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.three,
    gap: Spacing.two,
  },
});

const meta = {
  title: 'Dependencies Smoke Tests/Network',
  component: NetworkDemo,
} satisfies Meta<typeof NetworkDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
