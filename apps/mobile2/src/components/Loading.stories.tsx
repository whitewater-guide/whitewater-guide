import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';

import Loading from './Loading';

function LoadingContainer() {
  return (
    <View style={{ flex: 1, height: 200 }}>
      <Loading />
    </View>
  );
}

const meta: Meta<typeof LoadingContainer> = {
  title: 'Components/Loading',
  component: LoadingContainer,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
