import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import DownloadButton from './DownloadButton';

const region = {
  id: '__id__',
  premium: false,
  hasPremiumAccess: false,
};

it('should render nothing when cannot make payments in premium region', () => {
  const { container } = render(
    <DownloadButton
      region={{
        id: '__id__',
        premium: true,
        hasPremiumAccess: false,
      }}
      regionInProgress={null}
      canMakePayments={false}
      downloadRegion={jest.fn()}
    />,
  );
  expect(container.children).toHaveLength(0);
});

it('should render loading when region is downloading', () => {
  const downloadRegion = jest.fn();
  const { getByLabelText, getByRole } = render(
    <DownloadButton
      region={region}
      regionInProgress="__id__"
      canMakePayments={true}
      downloadRegion={downloadRegion}
    />,
  );
  expect(getByLabelText('loading')).toBeTruthy();
  const button = getByRole('button');
  fireEvent.press(button);
  expect(downloadRegion).toHaveBeenCalled();
});

it('should allow download when no region is in progress', () => {
  const downloadRegion = jest.fn();
  const { getByLabelText } = render(
    <DownloadButton
      region={region}
      regionInProgress={null}
      canMakePayments={true}
      downloadRegion={downloadRegion}
    />,
  );
  const button = getByLabelText('download');
  fireEvent.press(button);
  expect(downloadRegion).toHaveBeenCalled();
});

it('should not allow download when other region is in progress', () => {
  const downloadRegion = jest.fn();
  const { getByLabelText } = render(
    <DownloadButton
      region={region}
      regionInProgress="__id2__"
      canMakePayments={true}
      downloadRegion={downloadRegion}
    />,
  );
  const button = getByLabelText('download');
  fireEvent.press(button);
  expect(downloadRegion).not.toHaveBeenCalled();
});

it('should render error on region in progress', () => {
  const downloadRegion = jest.fn();
  const err = new Error('net fail');
  const { getByHintText } = render(
    <DownloadButton
      region={region}
      regionInProgress="__id__"
      canMakePayments={true}
      downloadRegion={downloadRegion}
      offlineError={err}
    />,
  );
  expect(getByHintText('download failed')).toBeTruthy();
});

it('should not render error on region not in progress', () => {
  const downloadRegion = jest.fn();
  const err = new Error('net fail');
  const { getByHintText } = render(
    <DownloadButton
      region={region}
      regionInProgress="__id_2__"
      canMakePayments={true}
      downloadRegion={downloadRegion}
      offlineError={err}
    />,
  );
  expect(() => getByHintText('download failed')).toThrow();
});
