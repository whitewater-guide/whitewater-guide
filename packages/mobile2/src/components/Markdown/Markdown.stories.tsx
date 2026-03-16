import Markdown from '@ronradtke/react-native-markdown-display';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

const SAMPLE_MARKDOWN = `
# Heading 1
## Heading 2
### Heading 3

This is a paragraph with **bold** and *italic* text.

- Bullet item 1
- Bullet item 2
- Bullet item 3

1. Numbered item 1
2. Numbered item 2

[Link to example](https://example.com)

> This is a blockquote

\`\`\`javascript
const hello = 'world';
console.log(hello);
\`\`\`

Inline \`code\` example.
`;

function MarkdownDemo() {
  return (
    <ScrollView style={styles.container}>
      <Markdown>{SAMPLE_MARKDOWN}</Markdown>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

const meta: Meta<typeof MarkdownDemo> = {
  title: 'Markdown',
  component: MarkdownDemo,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
