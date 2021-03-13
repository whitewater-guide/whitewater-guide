import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Clipboard } from 'react-native';

import { usePremiumAccess } from '~/features/purchases';
import { openGoogleMaps } from '~/utils/maps';

import CoordinatesInfo from './CoordinatesInfo';

const mockNavigate = jest.fn();

jest.mock('@whitewater-guide/clients', () => {
  const originalModule = jest.requireActual('@whitewater-guide/clients');
  return {
    __esModule: true,
    ...originalModule,
    useRegion: () => {
      return { node: { id: '__id__' } };
    },
  };
});
jest.mock('@react-navigation/native', () => ({
  // eslint-disable-next-line @typescript-eslint/ban-types
  ...jest.requireActual<{}>('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));
jest.mock('../../../features/purchases/usePremiumAccess');
jest.mock('../../../utils/maps', () => {
  return {
    __esModule: true,
    openGoogleMaps: jest.fn(),
  };
});

beforeEach(() => {
  jest.resetAllMocks();
});

const doRender = () =>
  render(
    <CoordinatesInfo
      label="Put-in"
      coordinates={[0, 0]}
      section={{ id: '__id__', demo: false } as any}
    />,
  );

describe('has premium access', () => {
  beforeEach(() => {
    (usePremiumAccess as jest.Mock).mockReturnValue(true);
  });

  it('should render coordinates', () => {
    const { getByText } = doRender();
    expect(getByText('0.0000, 0.0000')).toBeTruthy();
  });

  it('should copy coordinates', () => {
    const mockClipboard = jest.spyOn(Clipboard, 'setString');
    const { getByLabelText } = doRender();
    const copyBtn = getByLabelText('copy coordinate');
    fireEvent.press(copyBtn);
    expect(mockClipboard).toHaveBeenCalledWith('0.0000, 0.0000');
  });

  it('should navigate', () => {
    const { getByLabelText } = doRender();
    const navigateBtn = getByLabelText('navigate');
    fireEvent.press(navigateBtn);
    expect(openGoogleMaps).toHaveBeenCalledWith([0, 0]);
  });
});

describe('has no premium access', () => {
  beforeEach(() => {
    (usePremiumAccess as jest.Mock).mockReturnValue(false);
  });

  it('should not render coordinates', () => {
    const { getByText } = doRender();
    expect(() => getByText('0.0000, 0.0000')).toThrow();
  });

  it('should not copy coordinates', () => {
    const mockClipboard = jest.spyOn(Clipboard, 'setString');
    const { getByLabelText } = doRender();
    const copyBtn = getByLabelText('copy coordinate');
    fireEvent.press(copyBtn);
    expect(mockClipboard).not.toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalled();
  });

  it('should not navigate', () => {
    const { getByLabelText } = doRender();
    const navigateBtn = getByLabelText('navigate');
    fireEvent.press(navigateBtn);
    expect(openGoogleMaps).not.toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalled();
  });
});
