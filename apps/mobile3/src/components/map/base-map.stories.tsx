import type { Meta, StoryObj } from '@storybook/react-native';
import { StyleSheet, View } from 'react-native';

import { BaseMap } from './base-map';
import { SAMPLE_BOUNDS } from './fixtures';
import { CameraProvider } from './hooks/use-camera';
import Layers from './layers';

function BaseMapWrapper() {
  return (
    <CameraProvider>
      <View style={styles.mapContainer}>
        <BaseMap
          mapType={Layers.TERRAIN.url}
          detailed={false}
          locationPermissionGranted={false}
          initialBounds={SAMPLE_BOUNDS}
        />
      </View>
    </CameraProvider>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
  },
});

const meta = {
  title: 'Map/BaseMap',
  component: BaseMapWrapper,
} satisfies Meta<typeof BaseMapWrapper>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
