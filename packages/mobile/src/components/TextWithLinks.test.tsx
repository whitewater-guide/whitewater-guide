import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import TextWithLinks from './TextWithLinks';

const setup = (onLink: (index: number) => void) =>
  render(
    <TextWithLinks onLink={onLink}>
      {
        'The content you are adding will be available under an open licence (CC). See our [Terms of Use](1) and [Privacy Policy](2)'
      }
    </TextWithLinks>,
  );

it('should render correctly', () => {
  const { toJSON } = setup(jest.fn());
  expect(toJSON()).toMatchInlineSnapshot(`
    <View
      collapsable={true}
      pointerEvents="box-none"
      style={
        Object {
          "flex": 1,
        }
      }
    >
      <Text>
        <Text>
          The content you are adding will be available under an open licence (CC). See our
        </Text>
        <Text
          style={
            Object {
              "color": "#2196f3",
            }
          }
        >
          Terms of Use
        </Text>
        <Text>
           and
        </Text>
        <Text
          style={
            Object {
              "color": "#2196f3",
            }
          }
        >
          Privacy Policy
        </Text>
      </Text>
    </View>
  `);
});

it('should fire onLink', () => {
  const onLink = jest.fn();
  const { getByText } = setup(onLink);
  const policy = getByText('Privacy Policy');
  fireEvent.press(policy);
  expect(onLink).toHaveBeenCalledWith(2);
});
