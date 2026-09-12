import type { Meta, StoryObj } from '@storybook/react-native';
import { StyleSheet, View } from 'react-native';

import FeaturesMap from './features-map';
import { SAMPLE_BOUNDS, SAMPLE_POIS, SAMPLE_SECTIONS } from './fixtures';
import { CameraProvider } from './hooks/use-camera';
import Layers from './layers';
import { MapSelectionProvider } from './map-selection';
import { SelectedPOISheet } from './panels/selected-poi-sheet';
import { SelectedSectionSheet } from './panels/selected-section-sheet';

import { StorySheetProvider } from '@/storybook/story-sheet-host';

function FeaturesMapWrapper() {
  return (
    <StorySheetProvider>
      <MapSelectionProvider>
        <CameraProvider>
          <View style={styles.mapContainer}>
            <FeaturesMap
              mapType={Layers.TERRAIN.url}
              detailed={false}
              locationPermissionGranted={false}
              initialBounds={SAMPLE_BOUNDS}
              sections={SAMPLE_SECTIONS}
              pois={SAMPLE_POIS}
            />
            <SelectedSectionSheet />
            <SelectedPOISheet />
          </View>
        </CameraProvider>
      </MapSelectionProvider>
    </StorySheetProvider>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
  },
});

const meta = {
  title: 'Map/FeaturesMap',
  component: FeaturesMapWrapper,
} satisfies Meta<typeof FeaturesMapWrapper>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
