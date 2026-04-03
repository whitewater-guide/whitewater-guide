import type { Meta, StoryObj } from '@storybook/react';
import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import type { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';

import { SwipeableListProvider } from '../../../../components/SwipeableListProvider';
import { ITEM_HEIGHT } from './constants';
import SectionListItem from './SectionListItem';

const baseSection = {
  __typename: 'Section' as const,
  id: 's1',
  name: 'Upper Gorge',
  altNames: [],
  updatedAt: '2024-01-01T00:00:00Z',
  hidden: false,
  helpNeeded: null,
  demo: false,
  verified: true,
  favorite: false,
  season: null,
  seasonNumeric: [],
  distance: 8,
  drop: 120,
  duration: 2,
  difficulty: 4,
  difficultyXtra: null,
  rating: 3.5,
  timezone: null,
  flowsText: null,
  region: { __typename: 'Region' as const, id: 'r1' },
  gauge: null,
  putIn: {
    __typename: 'Point' as const,
    id: 'p1',
    coordinates: [-122.4, 37.7] as [number, number],
    kind: 'put-in',
    name: 'Put-in',
  },
  takeOut: {
    __typename: 'Point' as const,
    id: 'p2',
    coordinates: [-122.3, 37.8] as [number, number],
    kind: 'take-out',
    name: 'Take-out',
  },
  tags: [],
  levels: null,
  flows: null,
  river: {
    __typename: 'River' as const,
    id: 'rv1',
    name: 'Big Creek',
    altNames: [],
  },
  flowsThumb: {
    color: '#4CAF50',
    value: '42',
    unit: 'm3s',
    fromNow: '2h ago',
  },
};

// Story that auto-opens the swipeable so you can inspect the underlay
function SwipedOpenItem() {
  const swipeRef = useRef<SwipeableMethods | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      swipeRef.current?.openRight();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <GestureHandlerRootView>
      <SwipeableListProvider>
        <View style={{ height: ITEM_HEIGHT }}>
          <SectionListItem section={baseSection} onPress={() => {}} />
        </View>
      </SwipeableListProvider>
    </GestureHandlerRootView>
  );
}

const meta: Meta<typeof SectionListItem> = {
  title: 'Region/SectionsList/SectionListItem',
  component: SectionListItem,
  decorators: [
    (Story) => (
      <GestureHandlerRootView>
        <SwipeableListProvider>
          <View style={{ height: ITEM_HEIGHT }}>
            <Story />
          </View>
        </SwipeableListProvider>
      </GestureHandlerRootView>
    ),
  ],
  args: {
    section: baseSection,
    onPress: () => {},
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SwipedOpen: StoryObj = {
  render: () => <SwipedOpenItem />,
  name: 'SwipedOpen (inspect underlay)',
};
