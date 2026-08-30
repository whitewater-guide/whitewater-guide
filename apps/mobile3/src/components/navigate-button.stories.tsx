import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

import NavigateButton, {
  NAVIGATE_BUTTON_WIDTH,
  type NavigateButtonProps,
} from './navigate-button';

const SCALE_INPUT: [number, number] = [-NAVIGATE_BUTTON_WIDTH, 0];
const SCALE_OUTPUT: [number, number] = [1, 0];

type NavigateButtonStoryProps = Omit<
  NavigateButtonProps,
  'scaleValue' | 'scaleInput' | 'scaleOutput'
>;

function NavigateButtonWithShared(props: NavigateButtonStoryProps) {
  const scaleValue = useSharedValue(-NAVIGATE_BUTTON_WIDTH);
  return (
    <NavigateButton
      {...props}
      scaleValue={scaleValue}
      scaleInput={SCALE_INPUT}
      scaleOutput={SCALE_OUTPUT}
    />
  );
}

const meta = {
  title: 'Components/NavigateButton',
  component: NavigateButtonWithShared,
  decorators: [
    (Story) => (
      <View style={{ padding: 16, flexDirection: 'row', gap: 8 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof NavigateButtonWithShared>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithPutIn: Story = {
  args: {
    label: 'Put-in',
    point: {
      id: 'point-1',
      coordinates: [-122.4194, 37.7749, 0],
      kind: 'put-in',
      name: 'Put-in',
    },
  },
};

export const WithTakeOut: Story = {
  args: {
    label: 'Take-out',
    point: {
      id: 'point-2',
      coordinates: [-122.3959, 37.7937, 0],
      kind: 'take-out',
      name: 'Take-out',
    },
  },
};

export const Disabled: Story = {
  args: {
    label: 'Put-in',
    point: null,
  },
};
