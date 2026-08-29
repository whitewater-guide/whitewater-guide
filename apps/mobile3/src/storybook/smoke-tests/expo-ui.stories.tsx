import { Button, Column, Host, Row, Text } from '@expo/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

function ExpoUIShowcase() {
  return (
    <View style={styles.container}>
      <Host matchContents>
        <Column spacing={Spacing.three}>
          <Text textStyle={{ fontSize: 20, fontWeight: '600' }}>
            Expo UI Smoke Test
          </Text>
          <Text>This verifies that @expo/ui Host, Button, and Text render.</Text>
          <Row spacing={Spacing.two}>
            <Button variant="outlined" label="Outlined" onPress={() => {}} />
            <Button variant="filled" label="Filled" onPress={() => {}} />
          </Row>
        </Column>
      </Host>

      <View style={styles.iconRow}>
        <SymbolView
          name="map.fill"
          size={32}
          tintColor="#0078B4"
          fallback={<ThemedText>map</ThemedText>}
        />
        <SymbolView
          name="drop.fill"
          size={32}
          tintColor="#03dac6"
          fallback={<ThemedText>drop</ThemedText>}
        />
        <SymbolView
          name="water.waves"
          size={32}
          tintColor="#ff5722"
          fallback={<ThemedText>waves</ThemedText>}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.three,
    gap: Spacing.four,
  },
  iconRow: {
    flexDirection: 'row',
    gap: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const meta = {
  title: 'Dependencies Smoke Tests/ExpoUI',
  component: ExpoUIShowcase,
} satisfies Meta<typeof ExpoUIShowcase>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
