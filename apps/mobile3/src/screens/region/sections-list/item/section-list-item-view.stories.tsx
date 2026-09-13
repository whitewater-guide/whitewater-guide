import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { ITEM_HEIGHT } from './constants';
import SectionListItemView from './section-list-item-view';
import type { ListedSection } from './types';

const baseSection: ListedSection = {
  id: 's1',
  name: 'Upper Gorge',
  verified: true,
  favorite: false,
  difficulty: 4,
  difficultyXtra: null,
  rating: 4,
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
};

const meta = {
  title: 'Region/SectionsList/SectionListItemView',
  component: SectionListItemView,
  decorators: [
    (Story) => (
      <View style={{ height: ITEM_HEIGHT }}>
        <Story />
      </View>
    ),
  ],
  args: {
    section: baseSection,
    onPress: () => {},
  },
} satisfies Meta<typeof SectionListItemView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Normal: Story = {};

export const Unverified: Story = {
  args: {
    section: { ...baseSection, verified: false },
  },
};

export const NoFlowData: Story = {
  args: {
    section: { ...baseSection, flowsThumb: undefined },
  },
};

export const HighStarRating: Story = {
  args: {
    section: { ...baseSection, rating: 5 },
  },
};

export const WithFlowData: Story = {
  args: {
    section: {
      ...baseSection,
      rating: 3.5,
      flowsThumb: {
        color: '#4CAF50',
        value: '42',
        unit: 'm3s',
        fromNow: '2h ago',
      },
    },
  },
};
