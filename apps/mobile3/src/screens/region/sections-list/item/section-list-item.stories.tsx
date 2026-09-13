import type { Meta, StoryObj } from '@storybook/react-native';
import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import type { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';

import { SwipeableListProvider } from '@/components/swipeable-list-provider';

import { ITEM_HEIGHT } from './constants';
import SectionListItem from './section-list-item';
import type { ListedSection } from './types';

const baseSection: ListedSection = {
  id: 's1',
  name: 'Upper Gorge',
  verified: true,
  favorite: false,
  difficulty: 4,
  difficultyXtra: null,
  rating: 3.5,
  putIn: {
    id: 'p1',
    coordinates: [-122.4, 37.7, 0],
    kind: 'put-in',
    name: 'Put-in',
  },
  takeOut: {
    id: 'p2',
    coordinates: [-122.3, 37.8, 0],
    kind: 'take-out',
    name: 'Take-out',
  },
  river: { id: 'rv1', name: 'Big Creek' },
  flowsThumb: {
    color: '#4CAF50',
    value: '42',
    unit: 'm3s',
    fromNow: '2h ago',
  },
};

function SwipedOpenItem() {
  const swipeRef = useRef<SwipeableMethods | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      swipeRef.current?.openRight();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SectionListItem ref={swipeRef} section={baseSection} onPress={() => {}} />
  );
}

const meta = {
  title: 'Region/SectionsList/SectionListItem',
  component: SectionListItem,
  decorators: [
    (Story) => (
      <SwipeableListProvider>
        <View style={{ height: ITEM_HEIGHT }}>
          <Story />
        </View>
      </SwipeableListProvider>
    ),
  ],
  args: {
    section: baseSection,
    onPress: () => {},
  },
} satisfies Meta<typeof SectionListItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SwipedOpen: Story = {
  render: () => <SwipedOpenItem />,
  name: 'SwipedOpen (inspect underlay)',
};
