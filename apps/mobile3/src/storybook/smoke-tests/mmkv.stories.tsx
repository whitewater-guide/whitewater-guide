import type { Meta, StoryObj } from '@storybook/react-native';
import { useCallback, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { createMMKV, type MMKV } from 'react-native-mmkv';

import { formatNullable, InfoRow, StoryButton } from './story-ui';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const STORAGE_KEY = 'storybook.mmkv.test';

const alphaStorage = createMMKV({ id: 'storybook-mmkv-alpha' });
const betaStorage = createMMKV({ id: 'storybook-mmkv-beta' });

type MmkvInstanceName = 'alpha' | 'beta';

interface MmkvInstances {
  alpha: MMKV;
  beta: MMKV;
}

const INSTANCES: MmkvInstances = {
  alpha: alphaStorage,
  beta: betaStorage,
};

interface MmkvInstanceView {
  id: string;
  exists: boolean;
  value: string | undefined;
}

function readInstance(storage: MMKV): MmkvInstanceView {
  return {
    id: storage.id,
    exists: storage.contains(STORAGE_KEY),
    value: storage.getString(STORAGE_KEY),
  };
}

function MMKVDemo() {
  const theme = useTheme();
  const [instanceName, setInstanceName] = useState<MmkvInstanceName>('alpha');
  const [input, setInput] = useState('');
  const [alpha, setAlpha] = useState(() => readInstance(alphaStorage));
  const [beta, setBeta] = useState(() => readInstance(betaStorage));
  const [lastRead, setLastRead] = useState<string | undefined>();
  const [hasRead, setHasRead] = useState(false);

  const refresh = useCallback(() => {
    setAlpha(readInstance(alphaStorage));
    setBeta(readInstance(betaStorage));
  }, []);

  const storage = INSTANCES[instanceName];

  const handleSelectInstance = useCallback((name: MmkvInstanceName) => {
    setInstanceName(name);
    setHasRead(false);
    setLastRead(undefined);
  }, []);

  const handleWrite = useCallback(() => {
    storage.set(STORAGE_KEY, input);
    refresh();
  }, [input, refresh, storage]);

  const handleRead = useCallback(() => {
    setLastRead(storage.getString(STORAGE_KEY));
    setHasRead(true);
    refresh();
  }, [refresh, storage]);

  const handleRemove = useCallback(() => {
    storage.remove(STORAGE_KEY);
    setLastRead(undefined);
    setHasRead(false);
    refresh();
  }, [refresh, storage]);

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle">MMKV</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        Synchronous get/set/remove. Named instances are isolated by id.
      </ThemedText>
      <StoryButton
        label="Use alpha instance"
        variant={instanceName === 'alpha' ? 'filled' : 'outlined'}
        onPress={() => handleSelectInstance('alpha')}
      />
      <StoryButton
        label="Use beta instance"
        variant={instanceName === 'beta' ? 'filled' : 'outlined'}
        onPress={() => handleSelectInstance('beta')}
      />
      <InfoRow label="Active id" value={storage.id} />
      <TextInput
        placeholder="Value to store"
        placeholderTextColor={theme.textSecondary}
        value={input}
        onChangeText={setInput}
        style={[
          styles.input,
          { color: theme.text, borderColor: theme.backgroundSelected },
        ]}
      />
      <StoryButton label="Write" onPress={handleWrite} />
      <StoryButton label="Read" variant="outlined" onPress={handleRead} />
      <StoryButton label="Remove" variant="outlined" onPress={handleRemove} />
      <ThemedText>
        Read value:{' '}
        {hasRead ? (lastRead ?? '(missing)') : '(not read yet)'}
      </ThemedText>
      <InfoRow
        label={`${alpha.id} exists`}
        value={formatNullable(alpha.exists)}
      />
      <InfoRow
        label={`${alpha.id} value`}
        value={formatNullable(alpha.value)}
      />
      <InfoRow
        label={`${beta.id} exists`}
        value={formatNullable(beta.exists)}
      />
      <InfoRow
        label={`${beta.id} value`}
        value={formatNullable(beta.value)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
});

const meta = {
  title: 'Dependencies Smoke Tests/MMKV',
  component: MMKVDemo,
} satisfies Meta<typeof MMKVDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
