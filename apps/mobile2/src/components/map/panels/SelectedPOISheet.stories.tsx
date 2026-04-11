import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import type { Meta, StoryObj } from '@storybook/react';
import {
  MapSelectionProvider,
  useMapSelection,
} from '@whitewater-guide/clients';
import type { PointCoreFragment } from '@whitewater-guide/schema';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SelectedPOISheet } from './SelectedPOISheet';

const FIXTURE_POI: PointCoreFragment = {
  __typename: 'Point',
  id: 'poi-1',
  name: 'Riverside Campsite',
  description:
    'A beautiful campsite right by the river. Facilities include fire pits and toilets. Good access road.',
  kind: 'campsite',
  coordinates: [43.15, 42.52, 0],
};

function SelectionActivator() {
  const [, onSelected] = useMapSelection();
  useEffect(() => {
    const timer = setTimeout(() => onSelected(FIXTURE_POI), 300);
    return () => clearTimeout(timer);
  }, [onSelected]);
  return null;
}

function SelectedPOISheetStory() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <BottomSheetModalProvider>
          <MapSelectionProvider>
            <SelectionActivator />
            <SelectedPOISheet />
          </MapSelectionProvider>
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const meta: Meta<typeof SelectedPOISheetStory> = {
  title: 'Map/SelectedPOISheet',
  component: SelectedPOISheetStory,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Open: Story = {};
