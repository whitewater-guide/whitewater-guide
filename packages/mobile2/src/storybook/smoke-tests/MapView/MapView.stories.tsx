import Mapbox from '@rnmapbox/maps';
import type { Meta, StoryObj } from '@storybook/react';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Config from 'react-native-config';
import { Text } from 'react-native-paper';

function MapViewDemo() {
  useEffect(() => {
    Mapbox.setAccessToken(Config.MAPBOX_ACCESS_TOKEN ?? '');
    Mapbox.setTelemetryEnabled(false);
  }, []);

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.header}>
        Mapbox Smoke Test
      </Text>
      <Mapbox.MapView style={styles.map}>
        <Mapbox.Camera zoomLevel={9} centerCoordinate={[-73.97, 40.78]} />
      </Mapbox.MapView>
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
  map: {
    flex: 1,
  },
});

const meta: Meta<typeof MapViewDemo> = {
  title: 'Dependencies Smoke Tests/MapView',
  component: MapViewDemo,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
