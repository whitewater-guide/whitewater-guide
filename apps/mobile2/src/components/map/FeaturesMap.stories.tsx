import type { Meta, StoryObj } from '@storybook/react';
import type { ListedSectionFragment } from '@whitewater-guide/clients';
import { MapSelectionProvider } from '@whitewater-guide/clients';
import type { PointCoreFragment } from '@whitewater-guide/schema';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import FeaturesMap from './FeaturesMap';
import { CameraProvider } from './hooks/useCamera';
import Layers from './layers';

const SAMPLE_BOUNDS: CodegenCoordinates[] = [
  [42.5, 42.0],
  [43.5, 42.0],
  [43.5, 43.0],
  [42.5, 43.0],
  [42.5, 42.0],
];

const SAMPLE_SECTIONS: ListedSectionFragment[] = [
  {
    __typename: 'Section',
    id: 'section-1',
    name: 'Upper Gorge',
    difficulty: 4,
    difficultyXtra: null,
    rating: 4.5,
    verified: true,
    demo: false,
    distance: 8.5,
    duration: null,
    drop: 120,
    season: 'Spring',
    seasonNumeric: [4, 5, 6, 7, 8, 9],
    river: { __typename: 'River', id: 'river-1', name: 'Argun' },
    putIn: {
      __typename: 'Point',
      id: 'put-in-1',
      coordinates: [43.0, 42.5, 0],
      name: 'Put-in',
      description: null,
      kind: 'put-in',
    },
    takeOut: {
      __typename: 'Point',
      id: 'take-out-1',
      coordinates: [43.2, 42.6, 0],
      name: 'Take-out',
      description: null,
      kind: 'take-out',
    },
    shape: [
      [43.0, 42.5, 0],
      [43.1, 42.55, 0],
      [43.2, 42.6, 0],
    ],
    flowsText: null,
    gauge: null,
    flows: null,
    levels: null,
    tags: [],
    approximate: false,
  } as any,
];

const SAMPLE_POIS: PointCoreFragment[] = [
  {
    __typename: 'Point',
    id: 'poi-1',
    name: 'Campsite',
    description: 'A nice campsite by the river',
    kind: 'campsite',
    coordinates: [43.15, 42.52, 0],
  },
];

function FeaturesMapWrapper() {
  return (
    <GestureHandlerRootView style={styles.root}>
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
          </View>
        </CameraProvider>
      </MapSelectionProvider>
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

const meta: Meta<typeof FeaturesMapWrapper> = {
  title: 'Map/FeaturesMap',
  component: FeaturesMapWrapper,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
