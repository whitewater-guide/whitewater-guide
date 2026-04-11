import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import type { Meta, StoryObj } from '@storybook/react';
import type { ListedSectionFragment } from '@whitewater-guide/clients';
import {
  MapSelectionProvider,
  useMapSelection,
} from '@whitewater-guide/clients';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SelectedSectionSheet } from './SelectedSectionSheet';

const FIXTURE_SECTION: ListedSectionFragment = {
  __typename: 'Section',
  id: 'section-1',
  name: 'Upper Gorge',
  difficulty: 4,
  difficultyXtra: '+',
  rating: 4.2,
  verified: true,
  demo: false,
  distance: 8.5,
  duration: null,
  drop: 120,
  season: 'April - October',
  seasonNumeric: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
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
} as any;

function SelectionActivator() {
  const [, onSelected] = useMapSelection();
  useEffect(() => {
    const timer = setTimeout(() => onSelected(FIXTURE_SECTION), 300);
    return () => clearTimeout(timer);
  }, [onSelected]);
  return null;
}

function SelectedSectionSheetStory() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <BottomSheetModalProvider>
          <MapSelectionProvider>
            <SelectionActivator />
            <SelectedSectionSheet />
          </MapSelectionProvider>
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const meta: Meta<typeof SelectedSectionSheetStory> = {
  title: 'Map/SelectedSectionSheet',
  component: SelectedSectionSheetStory,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Open: Story = {};
