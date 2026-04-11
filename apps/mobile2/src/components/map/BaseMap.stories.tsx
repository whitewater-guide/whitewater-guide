import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { BaseMap } from './BaseMap';
import { CameraProvider } from './hooks/useCamera';
import Layers from './layers';

// Roughly Georgia/Russia area (sample region bounds)
const SAMPLE_BOUNDS: CodegenCoordinates[] = [
  [42.5, 42.0],
  [43.5, 42.0],
  [43.5, 43.0],
  [42.5, 43.0],
  [42.5, 42.0],
];

function BaseMapWrapper() {
  return (
    <GestureHandlerRootView style={styles.root}>
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
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
});

const meta: Meta<typeof BaseMapWrapper> = {
  title: 'Map/BaseMap',
  component: BaseMapWrapper,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
