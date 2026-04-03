import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';

import { ITEM_HEIGHT } from './constants';
import SectionListItemView from './SectionListItemView';

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
  rating: 4,
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
  river: { __typename: 'River' as const, id: 'rv1', name: 'Big Creek', altNames: [] },
};

const meta: Meta<typeof SectionListItemView> = {
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
};

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
