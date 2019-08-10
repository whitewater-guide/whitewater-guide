import React from 'react';
import { Clipboard } from 'react-native';
import { fireEvent, render } from 'react-native-testing-library';
import { RegionInfoMenu } from './RegionInfoMenu';

jest.mock('ActionSheetIOS');

jest.mock('react-apollo', () => ({
  useApolloClient: () => ({
    readFragment: jest.fn().mockReturnValue({
      description: 'foobar',
    }),
  }),
}));

it('should copy to clipboard', () => {
  const spy = jest.spyOn(Clipboard, 'setString');
  const { getByTestId } = render(<RegionInfoMenu regionId="_region_id_" />);
  fireEvent.press(getByTestId('region-info-menu-button'));
  fireEvent(getByTestId('region-info-menu-actionsheet'), 'press', 0);
  expect(spy).toHaveBeenCalledWith('foobar');
});
