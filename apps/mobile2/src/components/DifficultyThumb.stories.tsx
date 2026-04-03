import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';

import DifficultyThumb from './DifficultyThumb';

function Container({ children }: { children: React.ReactNode }) {
  return (
    <View style={{ padding: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {children}
    </View>
  );
}

const meta: Meta<typeof DifficultyThumb> = {
  title: 'Components/DifficultyThumb',
  component: DifficultyThumb,
  decorators: [
    (Story) => (
      <Container>
        <Story />
      </Container>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Difficulty1: Story = { args: { difficulty: 1 } };
export const Difficulty3: Story = { args: { difficulty: 3 } };
export const Difficulty5: Story = { args: { difficulty: 5 } };
export const Difficulty6: Story = { args: { difficulty: 6 } };
export const WithXtra: Story = { args: { difficulty: 4, difficultyXtra: 'V' } };
export const NoBorder: Story = { args: { difficulty: 3, noBorder: true } };
export const NullDifficulty: Story = { args: { difficulty: null } };
