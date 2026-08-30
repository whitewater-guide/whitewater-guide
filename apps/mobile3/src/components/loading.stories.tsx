import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Loading } from './loading';

function LoadingContainer() {
  return (
    <View style={{ flex: 1, height: 200 }}>
      <Loading />
    </View>
  );
}

const meta = {
  title: 'Components/Loading',
  component: LoadingContainer,
} satisfies Meta<typeof LoadingContainer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
