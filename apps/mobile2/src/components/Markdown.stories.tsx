import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ScrollView } from 'react-native';

import Markdown from './Markdown';

const meta: Meta<typeof Markdown> = {
  title: 'Components/Markdown',
  component: Markdown,
  decorators: [
    (Story) => (
      <ScrollView style={{ padding: 16 }}>
        <Story />
      </ScrollView>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const PlainText: Story = {
  args: { children: 'This is plain text content.' },
};

export const Headers: Story = {
  args: { children: '# Heading 1\n\n## Heading 2\n\n### Heading 3' },
};

export const BoldItalic: Story = {
  args: { children: 'This is **bold** and this is *italic* text.' },
};

export const Links: Story = {
  args: { children: 'Check out [this link](https://example.com) for more info.' },
};

export const Lists: Story = {
  args: {
    children:
      'Unordered:\n- Item one\n- Item two\n- Item three\n\nOrdered:\n1. First\n2. Second\n3. Third',
  },
};

export const CodeBlock: Story = {
  args: {
    children: 'Inline `code` and:\n\n```\nconst x = 42;\nconsole.log(x);\n```',
  },
};

export const EmptyString: Story = {
  args: { children: '' },
};
