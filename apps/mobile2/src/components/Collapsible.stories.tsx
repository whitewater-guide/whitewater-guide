import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { Collapsible, useCollapsible } from './Collapsible';

function CollapsibleDemo({
  initialCollapsed,
  longContent,
}: {
  initialCollapsed: boolean;
  longContent?: boolean;
}) {
  const [collapsed, toggleCollapsed] = useCollapsible(initialCollapsed);
  return (
    <View style={{ padding: 16 }}>
      <Pressable
        onPress={toggleCollapsed}
        style={{ padding: 8, backgroundColor: '#2196f3', marginBottom: 8 }}
      >
        <Text style={{ color: 'white' }}>
          {collapsed ? 'Expand' : 'Collapse'}
        </Text>
      </Pressable>
      <Collapsible collapsed={collapsed} collapsedHeight={48}>
        <Text>Line 1: always visible</Text>
        <Text>Line 2: visible when expanded</Text>
        {longContent && (
          <>
            <Text>Line 3</Text>
            <Text>Line 4</Text>
            <Text>Line 5</Text>
            <Text>Line 6</Text>
            <Text>Line 7</Text>
            <Text>Line 8</Text>
          </>
        )}
      </Collapsible>
    </View>
  );
}

const meta: Meta<typeof CollapsibleDemo> = {
  title: 'Components/Collapsible',
  component: CollapsibleDemo,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Collapsed: Story = { args: { initialCollapsed: true } };
export const Expanded: Story = { args: { initialCollapsed: false } };
export const LongContent: Story = {
  args: { initialCollapsed: true, longContent: true },
};
