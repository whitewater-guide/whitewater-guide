import React from 'react';
import { Clipboard } from 'react-native';
import { fireEvent, render } from 'react-native-testing-library';
import { SectionGuideMenu } from './SectionGuideMenu';

jest.mock('ActionSheetIOS');

const section: any = {
  description: 'foobar',
};

it('should copy to clipboard', () => {
  const spy = jest.spyOn(Clipboard, 'setString');
  const { getByTestId } = render(<SectionGuideMenu section={section} />);
  fireEvent.press(getByTestId('section-info-menu-button'));
  fireEvent(getByTestId('section-info-menu-actionsheet'), 'press', 0);
  expect(spy).toHaveBeenCalledWith('foobar');
});
