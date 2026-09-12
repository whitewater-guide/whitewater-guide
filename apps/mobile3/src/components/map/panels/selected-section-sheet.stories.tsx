import type { Meta, StoryObj } from '@storybook/react-native';
import { StyleSheet, View } from 'react-native';

import { SAMPLE_SECTION } from '../fixtures';
import { MapSelectionProvider, useMapSelection } from '../map-selection';
import { SelectedSectionSheet } from './selected-section-sheet';

import { StoryButton } from '@/storybook/smoke-tests/story-ui';
import { StorySheetModal } from '@/storybook/story-sheet-host';
import { Spacing } from '@/constants/theme';

function SelectSectionButton() {
  const [selection, onSelected] = useMapSelection();
  return (
    <View style={styles.content}>
      <StoryButton
        label="Select section"
        onPress={() => onSelected(SAMPLE_SECTION)}
      />
      <StorySheetModal
        visible={selection != null}
        onRequestClose={() => onSelected(null)}
      >
        <SelectedSectionSheet />
      </StorySheetModal>
    </View>
  );
}

function SelectedSectionSheetStory() {
  return (
    <MapSelectionProvider>
      <SelectSectionButton />
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
  title: 'Map/SelectedSectionSheet',
  component: SelectedSectionSheetStory,
} satisfies Meta<typeof SelectedSectionSheetStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
