import type { Meta, StoryObj } from '@storybook/react-native';
import { StyleSheet, View } from 'react-native';

import { SAMPLE_POI } from '../fixtures';
import { MapSelectionProvider, useMapSelection } from '../map-selection';
import { SelectedPOISheet } from './selected-poi-sheet';

import { StoryButton } from '@/storybook/smoke-tests/story-ui';
import { StorySheetModal } from '@/storybook/story-sheet-host';
import { Spacing } from '@/constants/theme';

function SelectPoiButton() {
  const [selection, onSelected] = useMapSelection();
  return (
    <View style={styles.content}>
      <StoryButton
        label="Select POI"
        onPress={() => onSelected(SAMPLE_POI)}
      />
      <StorySheetModal
        visible={selection != null}
        onRequestClose={() => onSelected(null)}
      >
        <SelectedPOISheet />
      </StorySheetModal>
    </View>
  );
}

function SelectedPOISheetStory() {
  return (
    <MapSelectionProvider>
      <SelectPoiButton />
    </MapSelectionProvider>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: Spacing.three,
  },
});

const meta = {
  title: 'Map/SelectedPOISheet',
  component: SelectedPOISheetStory,
} satisfies Meta<typeof SelectedPOISheetStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
