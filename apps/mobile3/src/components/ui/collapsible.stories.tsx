import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Collapsible } from './collapsible';

import { ThemedText } from '@/components/themed-text';

export interface CollapsibleDemoProps {
  title: string;
  defaultOpen: boolean;
  longContent?: boolean;
}

function CollapsibleDemo({
  title,
  defaultOpen,
  longContent,
}: CollapsibleDemoProps) {
  return (
    <View style={{ padding: 16 }}>
      <Collapsible title={title} defaultOpen={defaultOpen}>
        <ThemedText type="small">Line 1: always visible</ThemedText>
        <ThemedText type="small">Line 2: visible when expanded</ThemedText>
        {longContent ? (
          <>
            <ThemedText type="small">Line 3</ThemedText>
            <ThemedText type="small">Line 4</ThemedText>
            <ThemedText type="small">Line 5</ThemedText>
            <ThemedText type="small">Line 6</ThemedText>
            <ThemedText type="small">Line 7</ThemedText>
            <ThemedText type="small">Line 8</ThemedText>
          </>
        ) : null}
      </Collapsible>
    </View>
  );
}

const meta = {
  title: 'Components/Collapsible',
  component: CollapsibleDemo,
  args: {
    title: 'Details',
  },
} satisfies Meta<typeof CollapsibleDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Collapsed: Story = { args: { defaultOpen: false } };
export const Expanded: Story = { args: { defaultOpen: true } };
export const LongContent: Story = {
  args: { defaultOpen: false, longContent: true },
};
