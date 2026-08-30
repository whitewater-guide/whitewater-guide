import type { Meta, StoryObj } from '@storybook/react-native';
import { TagCategory } from '@whitewater-guide/schema';
import { useState } from 'react';
import { View } from 'react-native';

import Chips, { TernaryChips } from './chips';

import type { SelectableTag } from '@/features/tags';
import { TagSelection } from '@/features/tags';

const chipsMeta = {
  title: 'Components/Chips',
  component: Chips,
  decorators: [
    (Story) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Chips>;

export default chipsMeta;

type ChipsStory = StoryObj<typeof chipsMeta>;

export const Empty: ChipsStory = { args: { items: [] } };

export const Single: ChipsStory = {
  args: { items: [{ id: '1', name: 'Beginner' }] },
};

export const MultiChip: ChipsStory = {
  args: {
    items: [
      { id: '1', name: 'Beginner' },
      { id: '2', name: 'Intermediate' },
      { id: '3', name: 'Expert' },
    ],
    label: 'Level',
  },
};

const INITIAL_TAGS: SelectableTag[] = [
  {
    id: '1',
    name: 'Kayak',
    category: TagCategory.Kayaking,
    selection: TagSelection.NONE,
  },
  {
    id: '2',
    name: 'Raft',
    category: TagCategory.Kayaking,
    selection: TagSelection.SELECTED,
  },
  {
    id: '3',
    name: 'SUP',
    category: TagCategory.Kayaking,
    selection: TagSelection.DESELECTED,
  },
];

function TernaryChipsInteractive() {
  const [tags, setTags] = useState<SelectableTag[]>(INITIAL_TAGS);
  return (
    <View style={{ padding: 16 }}>
      <TernaryChips tags={tags} onChange={setTags} />
    </View>
  );
}

export const TernaryInteractive: StoryObj = {
  render: () => <TernaryChipsInteractive />,
  name: 'TernaryChips/Interactive',
};

export const TernaryAllStates: StoryObj = {
  render: () => (
    <View style={{ padding: 16 }}>
      <TernaryChips tags={INITIAL_TAGS} />
    </View>
  ),
  name: 'TernaryChips/AllStates',
};
