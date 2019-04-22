import React from 'react';
import { Clipboard } from 'react-native';
import { fireEvent, render } from 'react-native-testing-library';
import { RegionInfoMenu } from './RegionInfoMenu';

jest.mock('ActionSheetIOS');

const region: any = {
  node: {
    description: 'foobar',
  },
};

it('should copy to clipboard', () => {
  const spy = jest.spyOn(Clipboard, 'setString');
  const { getByTestId } = render(<RegionInfoMenu region={region} />);
  fireEvent.press(getByTestId('region-info-menu-button'));
  fireEvent(getByTestId('region-info-menu-actionsheet'), 'press', 0);
  expect(spy).toHaveBeenCalledWith('foobar');
});
